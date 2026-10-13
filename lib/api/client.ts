import type { RegistrationPayload } from '@/lib/types'

export interface SubmitResult {
  ok: boolean
  message: string
  errors?: Record<string, string>
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
  }

  if (!response.ok) {
    return {
      ok: false,
      message: data.message ?? 'Something went wrong. Please try again.',
      errors: data.errors,
    }
  }

  return { ok: true, message: data.message ?? 'You are registered.' }
}
