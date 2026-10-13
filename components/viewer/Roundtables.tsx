import type { RoundtableEvent } from '@/lib/types'
import RegisterButton from '@/components/viewer/RegisterButton'
import { formatDateTime } from '@/lib/utils/format'

export default function Roundtables({ events }: { events: RoundtableEvent[] }) {
  return (
    <section id="roundtables" className="bg-surface py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Upcoming Roundtables
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Quick, weekly peer-driven discussions to diagnose your sales &amp;
            messaging blocks.
          </h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border-soft bg-white shadow-sm">
          <div className="hidden grid-cols-12 gap-4 border-b border-border-soft bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-body md:grid">
            <span className="col-span-4">Date &amp; Time</span>
            <span className="col-span-6">Topic</span>
            <span className="col-span-2 text-right">Seat</span>
          </div>

          <ul className="divide-y divide-border-soft">
            {events.map((event) => (
              <li
                key={event.id}
                className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-12 md:items-center"
              >
                <div className="md:col-span-4">
                  <p className="font-semibold text-ink">
                    {formatDateTime(event.startsAt, event.timezoneLabel)}
                  </p>
                  <p className="text-sm text-slate-body">
                    {event.durationMinutes} mins · Free
                  </p>
                </div>
                <div className="md:col-span-6">
                  <p className="font-medium text-ink">{event.title}</p>
                  <p className="text-sm text-slate-body">{event.focus}</p>
                </div>
                <div className="md:col-span-2 md:justify-self-end">
                  <RegisterButton event={event} variant="secondary">
                    Reserve Free Seat
                  </RegisterButton>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
