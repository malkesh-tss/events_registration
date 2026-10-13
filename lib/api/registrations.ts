import type { Registration, RegistrationPayload } from '@/lib/types'
import { getEventById } from '@/lib/api/events'

// Lightweight in-memory registration store (acts as the backend "database").
// Swap `store` for a real persistence layer (DB, Airtable, etc.) without
// touching the route handler contract.

const store: Registration[] = []

export interface ValidationResult {
  ok: boolean
  errors: Record<string, string>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateRegistration(payload: unknown): ValidationResult {
  const errors: Record<string, string> = {}
  const data = (payload ?? {}) as Partial<RegistrationPayload>

  if (!data.eventId || typeof data.eventId !== 'string') {
    errors.eventId = 'A valid event is required.'
  } else if (!getEventById(data.eventId)) {
    errors.eventId = 'We could not find that event.'
  }

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.'
  }

  if (!data.email || !EMAIL_RE.test(data.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  return { ok: Object.keys(errors).length === 0, errors }
}

export function createRegistration(payload: RegistrationPayload): Registration {
  const registration: Registration = {
    ...payload,
    id: `reg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  }
  store.push(registration)
  return registration
}

export function countRegistrationsFor(eventId: string): number {
  return store.filter((registration) => registration.eventId === eventId).length
}

export function listRegistrations(): Registration[] {
  return [...store]
}
