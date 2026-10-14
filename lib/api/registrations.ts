import type {
  Registration,
  RegistrationPayload,
  SummitEvent,
} from '@/lib/types'
import {
  ensureEventsTable,
  insertRegistration,
  readEventById,
} from '@/lib/api/db'
import type { EventRow } from '@/lib/api/db'
import { ZoomClient } from '@/lib/api/zoom'

export interface ValidationResult {
  ok: boolean
  errors: Record<string, string>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Converts a cached Eventbrite row into the SummitEvent shape. */
export function liveEventToSummit(row: EventRow): SummitEvent {
  return {
    id: row.id,
    format: row.kind ?? 'roundtable',
    title: row.title,
    startsAt: row.start_utc ?? '',
    durationMinutes: 60,
    timezoneLabel: 'PT',
    isFree: true,
    summary: (row.description ?? '').slice(0, 200),
    focus: (row.description ?? '').slice(0, 200),
    upcoming: true,
  }
}

/**
 * Resolves an event id against the Neon cache of live Eventbrite events
 * (the modal and schedules list upcoming Eventbrite events).
 */
export async function resolveEvent(id: string): Promise<SummitEvent | null> {
  await ensureEventsTable()
  const row = await readEventById(id)
  return row ? liveEventToSummit(row) : null
}

export async function validateRegistrationAsync(
  payload: unknown,
): Promise<ValidationResult> {
  const errors: Record<string, string> = {}
  const data = (payload ?? {}) as Partial<RegistrationPayload>

  if (!data.eventId || typeof data.eventId !== 'string') {
    errors.eventId = 'A valid event is required.'
  } else {
    try {
      if (!(await resolveEvent(data.eventId))) {
        errors.eventId = 'We could not find that event.'
      }
    } catch {
      // DB unreachable — we can't verify the event.
      errors.eventId = 'We could not find that event.'
    }
  }

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.'
  }

  if (!data.email || !EMAIL_RE.test(data.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!data.companyName || data.companyName.trim().length < 1) {
    errors.companyName = 'Please enter your company name.'
  }

  if (!data.role || data.role.trim().length < 1) {
    errors.role = 'Please enter your role.'
  }

  return { ok: Object.keys(errors).length === 0, errors }
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/)
  const firstName = parts.shift() ?? fullName.trim()
  const lastName = parts.join(' ')
  return { firstName, lastName: lastName || '-' }
}

/**
 * Registers an attendee for an event:
 *  1. Finds the matching scheduled Zoom meeting (title + start time).
 *  2. Adds the attendee as a Zoom registrant (Zoom emails them the join link).
 *  3. Persists the registration (with the join URL) to Neon.
 *
 * Throws ZoomError if Zoom is not configured or no meeting matches — the caller
 * must treat that as a failed registration (Zoom is required).
 */
export async function createRegistration(
  payload: RegistrationPayload,
): Promise<Registration> {
  const event = await resolveEvent(payload.eventId).catch(() => null)
  if (!event) {
    throw new Error('We could not find that event.')
  }
  if (!event.startsAt) {
    throw new Error('This event has no scheduled date yet — please try again later.')
  }

  const { firstName, lastName } = splitName(payload.fullName)
  const zoom = new ZoomClient()
  const meetingId = await zoom.findMeeting(event.title, new Date(event.startsAt))
  const registrant = await zoom.registerAttendee(
    meetingId,
    firstName,
    lastName,
    payload.email,
  )
  const joinUrl = registrant.join_url ?? registrant.start_url ?? null

  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `reg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  await insertRegistration(id, {
    event_id: event.id,
    event_title: event.title,
    full_name: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    company_name: payload.companyName?.trim() || null,
    role: payload.role?.trim() || null,
    goal: payload.goal?.trim() || null,
    zoom_meeting_id: meetingId,
    join_url: joinUrl,
  })

  return {
    ...payload,
    id,
    createdAt: new Date().toISOString(),
    zoomMeetingId: meetingId,
    joinUrl,
  }
}
