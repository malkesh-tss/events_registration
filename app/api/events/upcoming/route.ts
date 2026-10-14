import { NextResponse } from 'next/server'
import { getRoundTableEvents, getWorkshopEvents } from '@/lib/api/eventbrite'
import type { SummitEvent } from '@/lib/types'

// GET /api/events/upcoming?limit=10
// Live upcoming events straight from Eventbrite (cached in Neon), returned in
// the same SummitEvent shape the registration modal consumes. Used by the
// "Reserve your spot" modal so its dropdown always shows real upcoming events.
// Runs at request time (reads the request URL + hits Eventbrite/Neon).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(25, Math.max(1, Number(searchParams.get('limit')) || 10))

  const [rt, ws] = await Promise.all([
    getRoundTableEvents(limit),
    getWorkshopEvents(limit),
  ])

  // Only events with a start date can drive a Zoom registration lookup.
  const toSummit = (
    events: typeof rt.events,
    format: 'roundtable' | 'workshop',
  ): SummitEvent[] =>
    events
      .filter((event) => event.startsAt)
      .map((event) => ({
        id: event.id,
        format,
        title: event.title,
        startsAt: event.startsAt as string,
        durationMinutes: 60,
        timezoneLabel: 'PT',
        isFree: true,
        summary: event.description,
        focus: event.description,
        upcoming: true,
      }))

  const events = [
    ...toSummit(rt.events, 'roundtable'),
    ...toSummit(ws.events, 'workshop'),
  ].sort(
    (a, b) =>
      new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  )

  const status =
    rt.source === 'none' && ws.source === 'none' && (rt.error || ws.error)
      ? 502
      : 200

  return NextResponse.json({ events, total: events.length }, { status })
}
