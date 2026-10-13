export default function FacilitatorBio() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-5 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-900 text-3xl font-extrabold text-accent-400">
          DG
        </div>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink">
            Meet Your Facilitator: Darrin Guttman
          </h2>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-brand-600">
            Founder &amp; CEO, The Scale Summit
          </p>
          <p className="mt-5 text-lg leading-relaxed text-slate-body">
            Darrin has spent his career helping bootstrapped and early-stage
            founders build sought-after brands and repeatable client acquisition
            engines — without massive marketing budgets. He's taken founders from
            being treated as a commodity to being booked as the trusted advisor,
            using the same zero-fluff frameworks you'll apply in every Scale Summit
            session. No theory you can't use — just the plays that move pipeline.
          </p>
        </div>
      </div>
    </section>
  )
}
