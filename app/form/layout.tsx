import { Suspense, type ReactNode } from 'react'

export default function FormLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-ivory px-4 text-slate-body">
          Loading registration form...
        </main>
      }
    >
      {children}
    </Suspense>
  )
}
