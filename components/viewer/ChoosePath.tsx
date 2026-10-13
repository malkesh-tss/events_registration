const paths = [
  {
    title: 'Free Roundtables',
    tag: 'Discussion-based',
    price: 'Free',
    length: '60 minutes',
    description:
      'Weekly, peer-driven virtual discussions to diagnose exactly where your client acquisition and messaging are breaking down.',
    points: [
      'Open, candid discussion among founders and CEOs',
      'Focused on identifying bottlenecks in client acquisition & messaging',
      'Bring your real problem — leave with sharp, practical feedback',
      'Zero pitch, zero fluff, zero cost',
    ],
    cta: { label: 'Join a Free Roundtable', href: '#roundtables' },
    accent: false,
  },
  {
    title: 'Interactive Workshops',
    tag: 'Hands-on framework application',
    price: 'From $99',
    length: '90 minutes',
    description:
      'Deep-dive working sessions where you apply proven playbooks — like Establish, Earn, Elevate — directly to your own pipeline.',
    points: [
      'Structured frameworks you build with live, not just listen to',
      'Deep-dive playbooks you can deploy the same week',
      'Work your actual offers, calls, and messaging in real time',
      'Leave with a written plan, not just notes',
    ],
    cta: { label: 'Browse Workshops', href: '#workshops' },
    accent: true,
  },
]

export default function ChoosePath() {
  return (
    <section id="paths" className="mx-auto max-w-6xl px-5 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Choose Your Path to Scale
        </h2>
        <p className="mt-3 text-lg text-slate-body">
          Two formats, one outcome: escape commodity pricing and become the
          trusted advisor your market seeks out.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {paths.map((path) => (
          <div
            key={path.title}
            className={`relative flex flex-col rounded-2xl border p-8 shadow-sm transition hover:shadow-lg ${
              path.accent
                ? 'border-brand-600 bg-brand-900 text-white'
                : 'border-border-soft bg-white text-ink'
            }`}
          >
            <span
              className={`mb-3 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                path.accent
                  ? 'bg-accent-500 text-ink'
                  : 'bg-brand-50 text-brand-700'
              }`}
            >
              {path.tag}
            </span>
            <h3 className="text-2xl font-bold">{path.title}</h3>
            <p
              className={`mt-1 text-sm font-medium ${
                path.accent ? 'text-brand-100' : 'text-slate-body'
              }`}
            >
              {path.length} · {path.price}
            </p>
            <p
              className={`mt-4 ${path.accent ? 'text-brand-100' : 'text-slate-body'}`}
            >
              {path.description}
            </p>
            <ul className="mt-6 space-y-3">
              {path.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm">
                  <span
                    className={`mt-0.5 font-bold ${
                      path.accent ? 'text-accent-400' : 'text-brand-600'
                    }`}
                  >
                    ✓
                  </span>
                  <span className={path.accent ? 'text-white' : 'text-ink-soft'}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href={path.cta.href}
              className={`btn mt-8 w-full ${
                path.accent ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {path.cta.label}
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
