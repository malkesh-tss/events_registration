import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="border-t border-border-soft bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-slate-body sm:flex-row">
        <Image
          src="/logo.png"
          alt="The Scale Summit"
          width={480}
          height={200}
          className="h-8 w-auto"
        />
        <p>Hosted by Darrin Guttman · Founder &amp; CEO</p>
        <div className="flex items-center gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 hover:text-brand-700"
          >
            Facebook
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 hover:text-brand-700"
          >
            Linkedin
          </a>
        </div>
        <p>© 2026 The Scale Summit. All rights reserved.</p>
      </div>
    </footer>
  )
}
