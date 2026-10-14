import Image from 'next/image'
import RegisterButton from '@/components/viewer/RegisterButton'

const navLinks = [
  { href: '#roundtables', label: 'Roundtables' },
  { href: '#workshops', label: 'Workshops' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center" aria-label="The Scale Summit — home">
          <Image
            src="/logo.png"
            alt="The Scale Summit"
            width={480}
            height={200}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition hover:text-brand-600"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <RegisterButton variant="secondary" fullWidth={false}>
          Join Free
        </RegisterButton>
      </div>
    </header>
  )
}
