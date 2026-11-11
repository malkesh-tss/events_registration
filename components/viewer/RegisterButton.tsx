'use client'

import { useRouter } from 'next/navigation'
import type { SummitEvent } from '@/lib/types'

type Variant = 'primary' | 'secondary' | 'ghost'

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
}

export default function RegisterButton({
  event,
  variant = 'primary',
  children,
  fullWidth,
}: {
  event?: SummitEvent
  variant?: Variant
  children: React.ReactNode
  fullWidth?: boolean
}) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => {
        const url = event ? `/form?eventId=${encodeURIComponent(event.id)}` : '/form'
        router.push(url)
      }}
      className={`btn ${variantClass[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {children}
    </button>
  )
}
