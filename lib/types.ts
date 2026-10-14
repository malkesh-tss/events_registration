// Shared event & registration types used by both the API (backend) and the
// viewer (frontend). Keep this the single source of truth — do not redefine
// local DTOs in components.

export type EventFormat = 'roundtable' | 'workshop'

export interface BaseEvent {
  id: string
  format: EventFormat
  title: string
  /** ISO-8601 date string (e.g. "2026-10-08T19:00:00Z"). */
  startsAt: string
  /** Duration in minutes. */
  durationMinutes: number
  /** Display timezone label, e.g. "PT". */
  timezoneLabel: string
  isFree: boolean
  /** Optional price in USD cents for paid workshops. */
  priceCents?: number
  featured?: boolean
  summary: string
}

export interface RoundtableEvent extends BaseEvent {
  format: 'roundtable'
  focus: string
}

export interface WorkshopEvent extends BaseEvent {
  format: 'workshop'
  framework?: string
  /** Short "Framework: focus" line used in the schedule table. */
  focus?: string
  problem?: string
  /** "What You Will Explore" bullets for the featured session. */
  explore?: string[]
  /** Closing takeaway sentence for the featured session. */
  takeaway?: string
  /** Whether registration is still open (upcoming) vs. a past session. */
  upcoming?: boolean
  takeaways?: string[]
}

export type SummitEvent = RoundtableEvent | WorkshopEvent

export interface RegistrationPayload {
  eventId: string
  fullName: string
  email: string
  companyName?: string
  role?: string
  goal?: string
}

export interface Registration extends RegistrationPayload {
  id: string
  createdAt: string
  /** Zoom meeting the attendee was registered for. */
  zoomMeetingId?: string
  /** Direct join URL returned by Zoom (shown after a successful signup). */
  joinUrl?: string | null
}
