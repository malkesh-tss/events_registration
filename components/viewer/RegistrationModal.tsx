'use client'

import { useEffect, useMemo, useState } from 'react'
import type { SummitEvent } from '@/lib/types'
import { submitRegistration } from '@/lib/api/client'
import { formatDateTime, formatPrice } from '@/lib/utils/format'

interface RegistrationModalProps {
  events: SummitEvent[]
  selected: SummitEvent | null
  onClose: () => void
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function RegistrationModal({
  events,
  selected,
  onClose,
}: RegistrationModalProps) {
  const [eventId, setEventId] = useState(selected?.id ?? events[0]?.id ?? '')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [goal, setGoal] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [joinUrl, setJoinUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const activeEvent = useMemo(
    () => events.find((event) => event.id === eventId) ?? null,
    [events, eventId],
  )

  useEffect(() => {
    setEventId(selected?.id ?? events[0]?.id ?? '')
    setStatus('idle')
    setMessage('')
    setErrors({})
  }, [selected, events])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (status !== 'idle') return
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, status])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrors({})
    const result = await submitRegistration({
      eventId,
      fullName,
      email,
      companyName: companyName || undefined,
      role: role || undefined,
      goal: goal || undefined,
    })

    if (result.ok) {
      setStatus('success')
      setMessage(result.message)
      setJoinUrl(result.joinUrl ?? null)
    } else {
      setStatus('error')
      setMessage(result.message)
      setErrors(result.errors ?? {})
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {status === 'success' ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✓
            </div>
            <h3 className="text-xl font-bold text-ink">You're on the list!</h3>
            <p className="mt-2 text-slate-body">{message}</p>
            {joinUrl && (
              <a
                href={joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-6 w-full"
              >
                Join on Zoom
              </a>
            )}
            <button className="btn btn-ghost mt-3 w-full !border-border-soft !text-navy hover:!bg-ivory" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-ink">Reserve your spot</h3>
                <p className="mt-1 text-sm text-slate-body">
                  Free to attend · No prep required for Roundtables
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-lg px-2 py-1 text-2xl leading-none text-slate-body hover:bg-surface"
              >
                ×
              </button>
            </div>

            <label className="mb-4 block text-sm font-medium text-ink-soft">
              Event
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border-soft bg-white px-3 py-2 text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.format === 'roundtable' ? 'Roundtable' : 'Workshop'} —{' '}
                    {event.title}
                  </option>
                ))}
              </select>
            </label>

            {activeEvent && (
              <p className="mb-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-900">
                {formatDateTime(activeEvent.startsAt, activeEvent.timezoneLabel)} ·{' '}
                {formatPrice(activeEvent.priceCents, activeEvent.isFree)}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field
                label="Full name"
                value={fullName}
                onChange={setFullName}
                error={errors.fullName}
                required
              />
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                error={errors.email}
                required
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Company"
                  value={companyName}
                  onChange={setCompanyName}
                  optional
                />
                <Field label="Your role" value={role} onChange={setRole} optional />
              </div>

              <label className="block text-sm font-medium text-ink-soft">
                What do you most want to fix? (optional)
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border-soft px-3 py-2 text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  placeholder="e.g. client acquisition, messaging, pricing..."
                />
              </label>

              {status === 'error' && message && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Reserving...' : 'Claim Your Spot'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

interface FieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  error?: string
  required?: boolean
  optional?: boolean
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  error,
  required,
  optional,
}: FieldProps) {
  return (
    <label className="block text-sm font-medium text-ink-soft">
      {label} {optional && <span className="text-slate-body">(optional)</span>}
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-brand-100 ${
          error ? 'border-red-400' : 'border-border-soft focus:border-brand-500'
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}
