'use client'

import { useEffect, useState } from 'react'
import type { WorkshopEvent, SummitEvent } from '@/lib/types'
import type { LiveEvent } from '@/lib/api/eventbrite'
import RegisterButton from '@/components/viewer/RegisterButton'
import { formatDateTime } from '@/lib/utils/format'

interface DisplayRow {
  id: string
  title: string
  when: string
  focus: string
  startsAt: string | null
  upcoming: boolean
  url: string | null
}

function fromLive(events: LiveEvent[]): DisplayRow[] {
  return events.map((e) => ({
    id: e.id,
    title: e.title,
    when: e.date ?? '',
    focus: e.description,
    startsAt: e.startsAt,
    upcoming: e.eventStatus === 'active',
    url: e.eventbriteUrl,
  }))
}

function fromFallback(events: WorkshopEvent[]): DisplayRow[] {
  return events.map((e) => ({
    id: e.id,
    title: e.title,
    when: formatDateTime(e.startsAt, e.timezoneLabel),
    focus: e.focus ?? e.summary,
    startsAt: e.startsAt,
    upcoming: !!e.upcoming,
    url: null,
  }))
}

// Build a minimal SummitEvent so the "Register Free" button opens the
// registration modal preselecting this specific workshop (never the
// Eventbrite page).
function toSummit(row: DisplayRow): SummitEvent {
  return {
    id: row.id,
    format: 'workshop',
    title: row.title,
    startsAt: row.startsAt ?? '',
    durationMinutes: 60,
    timezoneLabel: 'PT',
    isFree: true,
    summary: row.focus,
    focus: row.focus,
  }
}

export default function WorkshopSchedule({
  fallback,
}: {
  fallback: WorkshopEvent[]
}) {
  const [rows, setRows] = useState<DisplayRow[]>(() => fromFallback(fallback))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/events/workshops?limit=6')
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
        <h3 className="text-xl font-bold text-ink">Upcoming Workshop Events</h3>
        {loading && (
          <span className="text-sm text-slate-body">Loading latest sessions…</span>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border-soft bg-white shadow-sm">
        <div className="hidden grid-cols-12 gap-4 border-b border-border-soft px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-body md:grid">
          <span className="col-span-3">Date &amp; Time</span>
          <span className="col-span-3">Workshop Title</span>
          <span className="col-span-4">Key Framework / Focus</span>
          <span className="col-span-2 text-right">Action</span>
        </div>

        <ul className="divide-y divide-border-soft">
          {rows.map((row) => (
            <li
              key={row.id}
              className="grid grid-cols-1 gap-3 px-6 py-5 md:grid-cols-12 md:items-center md:gap-4"
            >
              <div className="md:col-span-3">
                <p className="font-semibold text-ink">{row.when}</p>
                <p className="text-sm text-slate-body">60 mins · Free</p>
              </div>
              <div className="md:col-span-3">
                <p className="font-medium text-ink">{row.title}</p>
              </div>
              <div className="md:col-span-4">
                <p className="text-sm text-slate-body">{row.focus}</p>
              </div>
              <div className="md:col-span-2 md:justify-self-end">
                {row.upcoming ? (
                  <RegisterButton
                    event={toSummit(row)}
                    variant="secondary"
                  >
                    Register Free
                  </RegisterButton>
                ) : (
                  <a
                    href="#workshops"
                    className="btn btn-ghost !border-border-soft !text-navy hover:!bg-ivory"
                  >
                    View Event
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
