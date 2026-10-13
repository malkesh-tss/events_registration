'use client'

import type { SummitEvent } from '@/lib/types'
import { useRegistration } from '@/components/viewer/registration-context'

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
  const { open } = useRegistration()

  return (
    <button
      type="button"
      onClick={() => open(event)}
      className={`btn ${variantClass[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {children}
    </button>
  )
}
