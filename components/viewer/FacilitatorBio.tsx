import Image from 'next/image'
import RegisterButton from '@/components/viewer/RegisterButton'

export default function FacilitatorBio() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-20">
      <div className="rounded-3xl border border-border-soft bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          A Message From Our Founder
        </p>
        <div className="mt-5 flex items-center gap-4">
          <Image
            src="/darrin.jpg"
            alt="Darrin Guttman"
            width={128}
            height={128}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-gold"
          />
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">
              Darrin Guttman
            </h2>
            <p className="text-sm font-medium text-slate-body">
              Founder &amp; CEO, The Scale Summit
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-body">
          <p>
            After more than twenty years helping established companies scale, I
            realized the most overlooked group in business is early-stage founders
            bootstrapping growth alone.
          </p>
          <p>
            No one was addressing their real needs or guiding them through what it
            takes to build a client acquisition plan that turns confusion into
            confidence.
          </p>
          <p>That's why I started The Scale Summit.</p>
          <p>
            To change the small business world. To give business owners a place
            built 100% for them. A place to learn, engage, and gain clarity,
            direction, and confidence for growth.
          </p>
          <p className="font-semibold text-ink">We're not here to play small.</p>
          <blockquote className="border-l-4 border-accent-500 pl-4 italic text-ink-soft">
            "We're here to help you build something that lasts."
          </blockquote>
        </div>

        <div className="mt-8">
          <RegisterButton variant="primary">Be Part of It</RegisterButton>
        </div>
      </div>
    </section>
  )
}
