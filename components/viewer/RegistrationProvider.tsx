'use client'

import { useState } from 'react'
import type { SummitEvent } from '@/lib/types'
import {
  RegistrationContext,
  type RegistrationContextValue,
} from '@/components/viewer/registration-context'
import RegistrationModal from '@/components/viewer/RegistrationModal'

export default function RegistrationProvider({
  events,
  children,
}: {
  events: SummitEvent[]
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<SummitEvent | null>(null)

  const value: RegistrationContextValue = {
    open: (event) => {
      setSelected(event ?? null)
      setIsOpen(true)
    },
  }

  return (
    <RegistrationContext.Provider value={value}>
      {children}
      {isOpen && (
        <RegistrationModal
          events={events}
          selected={selected}
          onClose={() => setIsOpen(false)}
        />
      )}
    </RegistrationContext.Provider>
  )
}
