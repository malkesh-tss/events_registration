import type { RoundtableEvent } from '@/lib/types'
import RegisterButton from '@/components/viewer/RegisterButton'
import RoundtableSchedule from '@/components/viewer/RoundtableSchedule'

const joinBullets = [
  'Meet fellow business owners on your same journey',
  'Discuss high-level client acquisition strategies',
  'Pick up new ideas, strategies and aha moments',
]

const badges = [
  { icon: '🗓', label: 'Weekly Live Sessions' },
  { icon: '👤', label: 'Hosted by Our CEO' },
  { icon: '💬', label: '100% Value, Zero Sales' },
]

export default function Roundtables({ events }: { events: RoundtableEvent[] }) {
  return (
    <section id="roundtables" className="bg-surface py-20">
      <div className="mx-auto max-w-6xl px-5">
        {/* Intro */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Join Our Roundtable
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            The Only Resource Built for Early-Stage Business Owners Bootstrapping
            Growth
          </h2>
          <p className="mt-3 text-lg text-slate-body">
            Join our community of thousands of founders growing with guidance and
            support.
          </p>
          <ul className="mx-auto mt-6 max-w-xl space-y-2 text-left">
            {joinBullets.map((point) => (
              <li key={point} className="flex gap-3 text-ink-soft">
                <span className="mt-0.5 font-bold text-brand-600">•</span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <RegisterButton variant="primary">Join Our Free Roundtable</RegisterButton>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-4">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 rounded-full border border-border-soft bg-white px-5 py-2 text-sm font-medium text-ink shadow-sm"
            >
              <span aria-hidden>{badge.icon}</span>
              {badge.label}
            </div>
          ))}
        </div>

        {/* --- Hidden: "Why You Need This" / "What You Can Expect" ---
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border-soft bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-ink">Why You Need This</h3>
            <p className="mt-4 text-slate-body">
              You're an expert at what you do. That's why you started your
              business. But marketing and sales? That's not your zone of genius.
            </p>
            <p className="mt-3 text-slate-body">
              So you try things. Some work poorly, others worse.
            </p>
            <p className="mt-3 font-semibold text-ink">You're not alone.</p>
            <p className="mt-4 text-slate-body">
              Here, you're surrounded by thousands of business owners who are:
            </p>
            <ul className="mt-3 space-y-2">
              {[
                'Figuring out how to attract clients without wasting money or time',
                'Learning the strategies that actually work for bootstrapped businesses',
                'Building clarity, confidence, and predictable growth together',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-ink-soft">
                  <span className="mt-0.5 font-bold text-brand-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          What you can expect
          <div className="rounded-2xl border border-border-soft bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-ink">What You Can Expect</h3>
            <p className="mt-4 text-slate-body">
              Join 25–30 business owners for an open, engaging conversation where
              ideas, strategies, challenges, and wins are shared freely — all
              facilitated by our CEO.
            </p>
            <p className="mt-3 text-slate-body">
              We wrap up with focused networking to help you promote your
              business, connect with power partners, and meet potential leads.
            </p>
            <p className="mt-4 font-semibold text-ink">
              No sales pitches. No fluff. Just real conversations and valuable
              connections.
            </p>
            <p className="mt-3 text-sm italic text-slate-body">
              (Seats fill up every week, so register early!)
            </p>
          </div>
        </div>
        */}

        {/* Schedule — live from Eventbrite (cached in Neon), falls back to seed */}
        <RoundtableSchedule fallback={events} />
      </div>
    </section>
  )
}
