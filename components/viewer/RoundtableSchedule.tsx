'use client'

import { useEffect, useState } from 'react'
import type { RoundtableEvent } from '@/lib/types'
import type { LiveEvent } from '@/lib/api/eventbrite'
import RegisterButton from '@/components/viewer/RegisterButton'
import { formatDateTime } from '@/lib/utils/format'

interface DisplayRow {
  id: string
  title: string
  subtitle: string
  when: string
  url: string | null
}

function fromLive(events: LiveEvent[]): DisplayRow[] {
  return events.map((e) => ({
    id: e.id,
    title: e.title,
    subtitle: e.description,
    when: e.date ?? '',
    url: e.eventbriteUrl,
  }))
}

function fromFallback(events: RoundtableEvent[]): DisplayRow[] {
  return events.map((e) => ({
    id: e.id,
    title: e.title,
    subtitle: e.focus,
    when: formatDateTime(e.startsAt, e.timezoneLabel),
    url: null,
  }))
}

export default function RoundtableSchedule({
  fallback,
}: {
  fallback: RoundtableEvent[]
}) {
  const [rows, setRows] = useState<DisplayRow[]>(() => fromFallback(fallback))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/events/roundtables?limit=6')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('bad status'))))
      .then((data: { events?: LiveEvent[] }) => {
        if (cancelled) return
        if (Array.isArray(data.events) && data.events.length > 0) {
          setRows(fromLive(data.events))
        }
      })
      .catch(() => {
        /* keep fallback rows */
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-ink">Check Out Our Topics</h3>
        {loading && (
          <span className="text-sm text-slate-body">Loading latest sessions…</span>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border-soft bg-white shadow-sm">
        <div className="hidden grid-cols-12 gap-4 border-b border-border-soft bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-body md:grid">
          <span className="col-span-4">Date &amp; Time</span>
          <span className="col-span-6">Topic</span>
          <span className="col-span-2 text-right">Seat</span>
        </div>

        <ul className="divide-y divide-border-soft">
          {rows.map((row) => (
            <li
              key={row.id}
              className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-12 md:items-center"
            >
              <div className="md:col-span-4">
                <p className="font-semibold text-ink">{row.when}</p>
                <p className="text-sm text-slate-body">60 mins · Free</p>
              </div>
              <div className="md:col-span-6">
                <p className="font-medium text-ink">{row.title}</p>
                {row.subtitle && (
                  <p className="text-sm text-slate-body">{row.subtitle}</p>
                )}
              </div>
              <div className="md:col-span-2 md:justify-self-end">
                {row.url ? (
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    Reserve Free Seat
                  </a>
                ) : (
                  <RegisterButton variant="secondary">
                    Reserve Free Seat
                  </RegisterButton>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
