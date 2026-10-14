import type { RegistrationPayload, SummitEvent } from '@/lib/types'

export interface SubmitResult {
  ok: boolean
  message: string
  errors?: Record<string, string>
  joinUrl?: string | null
}

/** Fetches live upcoming events from Eventbrite for the registration modal. */
export async function fetchUpcomingEvents(): Promise<SummitEvent[]> {
  try {
    const response = await fetch('/api/events/upcoming', { cache: 'no-store' })
    if (!response.ok) return []
    const data = (await response.json()) as { events?: SummitEvent[] }
    return Array.isArray(data.events) ? data.events : []
  } catch {
    return []
  }
}

/** Client helper used by the registration form to talk to POST /api/registrations. */
export async function submitRegistration(
  payload: RegistrationPayload,
): Promise<SubmitResult> {
  const response = await fetch('/api/registrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => ({}))) as {
    message?: string
    errors?: Record<string, string>
    registration?: { joinUrl?: string | null }
  }

  if (!response.ok) {
    return {
      ok: false,
      message: data.message ?? 'Something went wrong. Please try again.',
      errors: data.errors,
    }
  }

  return {
    ok: true,
    message: data.message ?? 'You are registered.',
    joinUrl: data.registration?.joinUrl ?? null,
  }
}
