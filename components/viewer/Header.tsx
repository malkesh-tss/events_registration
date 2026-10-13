import RegisterButton from '@/components/viewer/RegisterButton'

const navLinks = [
  { href: '#paths', label: 'Roundtables vs Workshops' },
  { href: '#roundtables', label: 'Roundtables' },
  { href: '#workshops', label: 'Workshops' },
  { href: '#faq', label: 'FAQ' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold tracking-tight text-brand-900">
            The Scale Summit
          </span>
          <span className="hidden text-xs font-medium text-slate-body sm:inline">
            with Darrin Guttman
          </span>
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
