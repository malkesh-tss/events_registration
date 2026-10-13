import type { WorkshopEvent } from '@/lib/types'
import RegisterButton from '@/components/viewer/RegisterButton'
import { formatDateTime, formatPrice } from '@/lib/utils/format'

interface WorkshopsProps {
  featured: WorkshopEvent | undefined
  archive: WorkshopEvent[]
  nextWorkshop: WorkshopEvent | undefined
}

export default function Workshops({
  featured,
  archive,
  nextWorkshop,
}: WorkshopsProps) {
  return (
    <section id="workshops" className="mx-auto max-w-6xl px-5 py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Interactive Workshops
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Master proven frameworks you can apply directly to your pipeline.
        </h2>
      </div>

      {featured && (
        <div className="mt-10 overflow-hidden rounded-3xl border border-brand-600 bg-brand-900 text-white shadow-xl">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <span className="inline-flex rounded-full bg-accent-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
                ★ Featured · {formatDateTime(featured.startsAt, featured.timezoneLabel)}
              </span>
              <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 text-brand-100">{featured.summary}</p>

              <div className="mt-5 rounded-xl bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-400">
                  The problem
                </p>
                <p className="mt-1 text-sm text-white">{featured.problem}</p>
              </div>

              {featured.framework && (
                <p className="mt-4 text-sm text-brand-100">
                  Framework you'll master:{' '}
                  <strong className="text-white">"{featured.framework}"</strong>
                </p>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white p-6 text-ink">
                <p className="text-sm font-semibold text-slate-body">
                  90-minute working session
                </p>
                <p className="mt-1 text-2xl font-extrabold text-brand-900">
                  {formatPrice(featured.priceCents, featured.isFree)}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-body">
                  You'll walk away able to:
                </p>
                <ul className="mt-3 space-y-2">
                  {featured.takeaways?.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-ink-soft">
                      <span className="mt-0.5 font-bold text-brand-600">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <RegisterButton event={featured} variant="primary" fullWidth>
                  Register for This Workshop
                </RegisterButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-14">
        <h3 className="text-lg font-bold text-ink">Past Workshop Highlights</h3>
        <p className="text-sm text-slate-body">
          Loved by founders who came before you — new deep-dives drop every month.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {archive.map((workshop) => (
            <div
              key={workshop.id}
              className="rounded-2xl border border-border-soft bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-body">
                {formatDateTime(workshop.startsAt, workshop.timezoneLabel)}
              </p>
              <h4 className="mt-2 font-bold text-ink">{workshop.title}</h4>
              <p className="mt-2 text-sm text-slate-body">{workshop.summary}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <RegisterButton event={nextWorkshop} variant="primary">
          Register for Next Workshop
        </RegisterButton>
      </div>
    </section>
  )
}
