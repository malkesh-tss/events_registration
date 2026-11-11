import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-4 py-12 text-ink">
      <div className="w-full max-w-xl rounded-3xl border border-border-soft bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
          ✓
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          Success
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">
          Thank you!
        </h1>
        <p className="mt-3 text-slate-body">
          Your registration has been received. We’ll be in touch with the event details soon.
        </p>
        <Link href="/" className="btn btn-primary mt-6 inline-flex w-full justify-center">
          Back to home
        </Link>
      </div>
    </main>
  )
}
