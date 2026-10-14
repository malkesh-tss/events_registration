import { NextResponse } from 'next/server'
import {
  createRegistration,
  validateRegistration,
} from '@/lib/api/registrations'
import { ZoomError } from '@/lib/api/zoom'
import type { RegistrationPayload } from '@/lib/types'

// POST /api/registrations — register an attendee (requires a matching Zoom
// meeting; the attendee is added to Zoom and their join link is returned).
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

  try {
    const registration = await createRegistration(payload as RegistrationPayload)

    return NextResponse.json(
      {
        message:
          "You're registered! We've reserved your Zoom spot — use the join link below or check your inbox.",
        registration: {
          id: registration.id,
          eventId: registration.eventId,
          fullName: registration.fullName,
          email: registration.email,
          joinUrl: registration.joinUrl,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof ZoomError) {
      return NextResponse.json(
        { message: error.message },
        { status: 502 },
      )
    }
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
