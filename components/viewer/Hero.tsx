import Image from 'next/image'
import RegisterButton from '@/components/viewer/RegisterButton'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-brand-900 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(60% 60% at 20% 20%, #1f4bd0 0%, transparent 60%), radial-gradient(50% 50% at 85% 30%, #f59e0b 0%, transparent 55%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-accent-400">
          ⭐ For bootstrapped founders &amp; CEOs who want to scale without the fluff
        </p>
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          The Only Resource Built for Early-Stage Business Owners Bootstrapping
          Growth
        </h1>
        <p className="mt-5 max-w-2xl text-xl font-medium text-white">
          Join our community of thousands of founders growing with guidance and
          support.
        </p>
       

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#workshops" className="btn btn-ghost">
            <span className="text-white">Browse Upcoming Workshops</span>
          </a>
          <RegisterButton variant="primary">
            Join a Free Roundtable
          </RegisterButton>
        </div>

        <div className="mt-8 flex items-center gap-3 text-sm text-brand-100">
          <Image
            src="/darrin.jpg"
            alt="Darrin Guttman"
            width={72}
            height={72}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-accent-500"
          />
          <span>
            Facilitated by <strong className="text-white">Darrin Guttman</strong>,
            Founder &amp; CEO of The Scale Summit
          </span>
        </div>
      </div>
    </section>
  )
}
