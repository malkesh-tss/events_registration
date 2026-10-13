import type { SummitEvent } from '@/lib/types'
import RegisterButton from '@/components/viewer/RegisterButton'
import { formatDateTime } from '@/lib/utils/format'

export default function FinalCTA({ nextEvent }: { nextEvent?: SummitEvent }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 px-8 py-14 text-center text-white shadow-xl">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Your Market Doesn't Need Another Vendor. It Needs You — as the Trusted
          Advisor.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
          {nextEvent
            ? `Next up: ${nextEvent.title} · ${formatDateTime(nextEvent.startsAt, nextEvent.timezoneLabel)}`
            : 'Join this week — one click, no fluff.'}
        </p>
        <div className="mt-8 flex justify-center">
          <RegisterButton event={nextEvent} variant="primary">
            Claim Your Spot for Next Event
          </RegisterButton>
        </div>
      </div>
    </section>
  )
}
