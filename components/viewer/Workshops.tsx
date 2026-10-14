import type { WorkshopEvent } from '@/lib/types'
import RegisterButton from '@/components/viewer/RegisterButton'
import WorkshopSchedule from '@/components/viewer/WorkshopSchedule'

const valueProps = [
  {
    title: '100% Free & Interactive',
    body: 'A tactical 60-minute working session where you apply growth frameworks directly to your business.',
  },
  {
    title: 'Zero Fluff, Real Frameworks',
    body: 'Walk out with proven models (like Establish, Earn, Elevate) that you can use on your next sales call immediately.',
  },
  {
    title: 'Live Problem-Solving',
    body: 'Bring your current deals, sales objections, or messaging challenges to get solutions live.',
  },
]

export default function Workshops({ workshops }: { workshops: WorkshopEvent[] }) {
  const featured = workshops.find((workshop) => workshop.featured)

  return (
    <section id="workshops" className="mx-auto max-w-6xl px-5 py-20">
      {/* Header & Overview */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full bg-gold-soft px-4 py-1.5 text-sm font-semibold text-navy-deep">
          100% Free Live Interactive Workshop
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Stop Learning Theory. Start Applying Winning Growth Frameworks.
        </h2>
        <p className="mt-4 text-lg text-slate-body">
          Join a high-impact, 60-minute live working session designed for
          early-stage founders to master client acquisition, fix messaging, and
          close more deals—without pushing hard.
        </p>
        <div className="mt-7">
          <RegisterButton event={featured} variant="secondary">
            Register For Free Now
          </RegisterButton>
        </div>
      </div>

      {/* Why Attend */}
      <div className="mt-14">
        <h3 className="text-center text-2xl font-bold text-ink">Why Attend?</h3>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {valueProps.map((prop) => (
            <div
              key={prop.title}
              className="rounded-2xl border border-border-soft bg-white p-7 shadow-sm"
            >
              <h4 className="text-lg font-bold text-navy-deep">{prop.title}</h4>
              <p className="mt-2 text-slate-body">{prop.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Upcoming Session */}
      {featured && (
        <div className="mt-16 overflow-hidden rounded-3xl border border-navy-deep bg-navy-deep text-white shadow-xl">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <span className="inline-flex rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-navy-deep">
                ★ Featured Upcoming Session
              </span>
              <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 text-brand-100">
                <strong className="text-white">Time:</strong> Friday, October 16,
                2026 at 12:00 PM PDT / 3:00 PM EDT
              </p>
              <p className="mt-1 text-brand-100">
                <strong className="text-white">Format:</strong>{' '}
                {featured.durationMinutes}-Minute Interactive Workshop
              </p>

              <div className="mt-5 rounded-xl bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-muted">
                  The Problem
                </p>
                <p className="mt-1 text-sm text-white">{featured.problem}</p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white p-6 text-ink">
                <p className="text-sm font-bold text-navy-deep">
                  What You Will Explore
                </p>
                <ul className="mt-3 space-y-2">
                  {featured.explore?.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-ink-soft">
                      <span className="mt-0.5 font-bold text-gold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                {featured.takeaway && (
                  <p className="mt-4 border-t border-border-soft pt-4 text-sm text-slate-body">
                    <strong className="text-navy-deep">Takeaway:</strong>{' '}
                    {featured.takeaway}
                  </p>
                )}
                <RegisterButton
                  event={featured}
                  variant="secondary"
                  fullWidth
                >
                  Register for the Free Workshop
                </RegisterButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Workshop Events — live from Eventbrite (cached in Neon), falls back to seed */}
      <WorkshopSchedule fallback={workshops} />
    </section>
  )
}
