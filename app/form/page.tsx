'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { SummitEvent } from '@/lib/types'
import { fetchUpcomingEvents, submitRegistration } from '@/lib/api/client'
import { formatDateTime, formatPrice } from '@/lib/utils/format'

export default function RegistrationFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedEventId = searchParams.get('eventId') ?? ''

  const [events, setEvents] = useState<SummitEvent[]>([])
  const [eventId, setEventId] = useState(preselectedEventId)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [goal, setGoal] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false

    fetchUpcomingEvents().then((fetched) => {
      if (cancelled) return
      const roundtables = fetched.filter((event) => event.format === 'roundtable')
      setEvents(roundtables)
      if (!preselectedEventId && roundtables[0]) {
        setEventId(roundtables[0].id)
      }
    })

    return () => {
      cancelled = true
    }
  }, [preselectedEventId])

  useEffect(() => {
    if (!events.length) return
    if (!eventId || !events.some((item) => item.id === eventId)) {
      setEventId(preselectedEventId || events[0].id)
    }
  }, [eventId, events, preselectedEventId])

  const activeEvent = useMemo(
    () => events.find((item) => item.id === eventId) ?? null,
    [eventId, events],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrors({})

    const result = await submitRegistration({
      eventId,
      fullName,
      email,
      companyName,
      role,
      goal: goal || undefined,
    })

    if (!result.ok) {
      setStatus('error')
      setMessage(result.message)
      setErrors(result.errors ?? {})
      return
    }

    router.push('/form/thankyou')
  }

  return (
    <main className="min-h-screen bg-ivory px-4 py-12 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-3xl border border-border-soft bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
            Register
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
            Reserve your spot
          </h1>
          <p className="mt-2 text-sm text-slate-body">
            Free to attend · No prep required.
          </p>
        </div>

        {activeEvent && (
          <div className="mb-5 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-900">
            <div className="font-semibold">{activeEvent.title}</div>
            <div className="mt-1">
              {formatDateTime(activeEvent.startsAt, activeEvent.timezoneLabel)} ·{' '}
              {formatPrice(activeEvent.priceCents, activeEvent.isFree)}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-ink-soft">
            Event
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border-soft bg-white px-3 py-2 text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              {events.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.format === 'roundtable' ? 'Roundtable' : 'Workshop'} — {item.title}
                </option>
              ))}
            </select>
            {!events.length && (
              <p className="mt-2 text-xs text-slate-body">Loading upcoming events...</p>
            )}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              value={fullName}
              onChange={setFullName}
              required
              error={errors.fullName}
            />
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              required
              error={errors.email}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Company"
              value={companyName}
              onChange={setCompanyName}
              required
              error={errors.companyName}
            />
            <Field
              label="Your role"
              value={role}
              onChange={setRole}
              required
              error={errors.role}
            />
          </div>

          <label className="block text-sm font-medium text-ink-soft">
            What do you most want to fix? (optional)
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-border-soft px-3 py-2 text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="e.g. client acquisition, messaging, pricing..."
            />
          </label>

          {status === 'error' && message && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={status === 'submitting' || !eventId}
          >
            {status === 'submitting' ? 'Reserving...' : 'Claim Your Spot'}
          </button>
        </form>
      </div>
    </main>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  error?: string
}) {
  return (
    <label className="block text-sm font-medium text-ink-soft">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 w-full rounded-lg border border-border-soft px-3 py-2 text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}
