import {
  ensureEventsTable,
  readAllEvents,
  readActiveEvents,
  upsertEvents,
  archiveEvents,
  type EventRow,
  type EventKind,
} from '@/lib/api/db'

// A normalized Eventbrite event for the frontend.
export interface LiveEvent {
  id: string
  kind: EventKind
  title: string
  description: string
  date: string | null
  startsAt: string | null
  location: string
  image: { url: string; width: number | null; height: number | null } | null
  eventStatus: string
  eventbriteUrl: string | null
}

export interface EventsResult {
  events: LiveEvent[]
  total: number
  source: 'database' | 'eventbrite' | 'none'
  timestamp: string
  error?: string
  message?: string
}

interface EventbriteEvent {
  id: string
  name?: { text?: string }
  summary?: string
  description?: { text?: string }
  start?: { utc?: string }
  venue?: { name?: string }
  logo?: { original?: { url?: string; width?: number; height?: number } }
  url?: string
}

// Convert UTC to Pacific time (handles daylight saving automatically).
function convertUtcToPst(utcString: string | null | undefined): string | null {
  if (!utcString) return null
  const date = new Date(utcString)
  if (isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

function isEventInPast(utcString: string | null | undefined): boolean {
  if (!utcString) return false
  const eventTime = new Date(utcString)
  if (isNaN(eventTime.getTime())) return false
  const eventInPst = eventTime.toLocaleString('sv-SE', {
    timeZone: 'America/Los_Angeles',
  })
  const nowInPst = new Date().toLocaleString('sv-SE', {
    timeZone: 'America/Los_Angeles',
  })
  return eventInPst < nowInPst
}

function toLive(row: EventRow): LiveEvent {
  return {
    id: row.id,
    kind: row.kind ?? 'roundtable',
    title: row.title,
    description: (row.description ?? '').slice(0, 200),
    date: convertUtcToPst(row.start_utc),
    startsAt: row.start_utc ?? null,
    location: row.location ?? 'Online',
    image: row.image_url
      ? { url: row.image_url, width: row.image_width, height: row.image_height }
      : null,
    eventStatus: row.event_status,
    eventbriteUrl: row.eventbrite_url,
  }
}

async function fetchEventbrite(
  token: string,
  organizerId: string,
): Promise<EventbriteEvent[]> {
  const response = await fetch(
    `https://www.eventbriteapi.com/v3/organizers/${organizerId}/events/?status=live&expand=venue`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Eventbrite API error ${response.status}: ${text}`)
  }

  const data = (await response.json()) as { events?: EventbriteEvent[] }
  if (!Array.isArray(data.events)) {
    throw new Error('Invalid response format from Eventbrite API')
  }
  return data.events
}

// Match by title keyword: roundtables contain "roundtable", workshops contain
// "workshop". This keeps other event types (e.g. networking) out of both lists.
function matchesKind(name: string | undefined, kind: EventKind): boolean {
  const text = (name ?? '').toLowerCase()
  return kind === 'roundtable' ? text.includes('roundtable') : text.includes('workshop')
}

/**
 * Fetch upcoming events of a given kind from Eventbrite, cache them in Neon,
 * and return the next few active (upcoming) sessions. Falls back to the Neon
 * cache if Eventbrite is unreachable.
 */
export async function getEventsByKind(
  kind: EventKind,
  limit = 3,
): Promise<EventsResult> {
  const token = process.env.EVENTBRITE_TOKEN
  const organizerId = process.env.EVENTBRITE_ORGANIZER_ID || '76183053353'

  try {
    await ensureEventsTable()
    const existingEvents = await readAllEvents()

    if (!token) {
      const cached = await readActiveEvents(kind, limit)
      return {
        events: cached.map(toLive),
        total: cached.length,
        source: cached.length ? 'database' : 'none',
        timestamp: new Date().toISOString(),
        message: 'EVENTBRITE_TOKEN not set; served cached events.',
      }
    }

    let ebEvents: EventbriteEvent[]
    try {
      ebEvents = await fetchEventbrite(token, organizerId)
    } catch (err) {
      const cached = await readActiveEvents(kind, limit)
      return {
        events: cached.map(toLive),
        total: cached.length,
        source: cached.length ? 'database' : 'none',
        timestamp: new Date().toISOString(),
        message: `Eventbrite unavailable; served cached events. (${(err as Error).message})`,
      }
    }

    const filtered = ebEvents.filter((e) => matchesKind(e?.name?.text, kind))

    type Processed = Omit<EventRow, 'created_at' | 'updated_at'> & {
      startUtcRaw: string | null
    }

    const processed: Processed[] = filtered.map((event) => {
      const utcStart = event.start?.utc ?? null
      const isPast = isEventInPast(utcStart)
      const status = isPast ? 'past' : 'active'

      return {
        id: event.id,
        kind,
        title: event.name?.text || 'Untitled Event',
        description: event.description?.text || event.summary || '',
        location: event.venue?.name || 'Online',
        image_url: event.logo?.original?.url ?? null,
        image_width: event.logo?.original?.width ?? null,
        image_height: event.logo?.original?.height ?? null,
        start_utc: utcStart,
        event_status: status,
        eventbrite_url: event.url ?? null,
        startUtcRaw: utcStart,
      }
    })

    const activeUpcoming = processed
      .filter((e) => e.event_status === 'active')
      .sort(
        (a, b) =>
          new Date(a.startUtcRaw ?? 0).getTime() -
          new Date(b.startUtcRaw ?? 0).getTime(),
      )
      .slice(0, limit)

    // Write upcoming events to Neon (insert/update).
    const toWrite = activeUpcoming.map(({ startUtcRaw, ...rest }) => rest)
    await upsertEvents(toWrite)

    // Reconcile: archive any cached rows of this kind that are no longer an
    // active/upcoming match (past events, or events that stopped matching).
    const currentActiveIds = new Set(
      processed.filter((e) => e.event_status === 'active').map((e) => e.id),
    )
    const idsToArchive = existingEvents
      .filter(
        (e) =>
          (e.kind ?? 'roundtable') === kind &&
          e.event_status === 'active' &&
          !currentActiveIds.has(e.id),
      )
      .map((e) => e.id)
    await archiveEvents(idsToArchive)

    // Return the freshest view from the cache.
    const finalRows = await readActiveEvents(kind, limit)
    const events: LiveEvent[] = finalRows.length
      ? finalRows.map(toLive)
      : activeUpcoming.map((a) => toLive(a as unknown as EventRow))

    return {
      events,
      total: events.length,
      source: finalRows.length ? 'database' : 'eventbrite',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    try {
      const cached = await readActiveEvents(kind, limit)
      if (cached.length) {
        return {
          events: cached.map(toLive),
          total: cached.length,
          source: 'database',
          timestamp: new Date().toISOString(),
          message: 'Recovered from cache after error.',
        }
      }
    } catch {
      /* ignore */
    }

    return {
      events: [],
      total: 0,
      source: 'none',
      timestamp: new Date().toISOString(),
      error: 'Internal server error',
      message: (error as Error).message,
    }
  }
}

export function getRoundTableEvents(limit = 3): Promise<EventsResult> {
  return getEventsByKind('roundtable', limit)
}

export function getWorkshopEvents(limit = 6): Promise<EventsResult> {
  return getEventsByKind('workshop', limit)
}
