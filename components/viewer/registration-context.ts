'use client'

import { createContext, useContext } from 'react'
import type { SummitEvent } from '@/lib/types'

export interface RegistrationContextValue {
  open: (event?: SummitEvent) => void
}

export const RegistrationContext = createContext<RegistrationContextValue | null>(
  null,
)

export function useRegistration(): RegistrationContextValue {
  const ctx = useContext(RegistrationContext)
  if (!ctx) {
    throw new Error('useRegistration must be used within a RegistrationProvider')
  }
  return ctx
}
