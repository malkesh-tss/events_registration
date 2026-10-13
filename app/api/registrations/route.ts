import { NextResponse } from 'next/server'
import {
  createRegistration,
  validateRegistration,
} from '@/lib/api/registrations'
import type { RegistrationPayload } from '@/lib/types'

// POST /api/registrations — create a registration for an event.
export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { message: 'Invalid JSON body.' },
      { status: 400 },
    )
  }

  const { ok, errors } = validateRegistration(payload)
  if (!ok) {
    return NextResponse.json(
      { message: 'Please fix the errors below.', errors },
      { status: 422 },
    )
  }

  const registration = createRegistration(payload as RegistrationPayload)

  return NextResponse.json(
    {
      message: 'You are registered. Check your inbox for the confirmation.',
      registration: {
        id: registration.id,
        eventId: registration.eventId,
        fullName: registration.fullName,
        email: registration.email,
      },
    },
    { status: 201 },
  )
}
