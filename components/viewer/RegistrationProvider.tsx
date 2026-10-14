'use client'

import { useEffect, useState } from 'react'
import type { SummitEvent } from '@/lib/types'
import { fetchUpcomingEvents } from '@/lib/api/client'
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
  // Prefetched upcoming events (live from Eventbrite). Fetched once on page
  // load so the modal's dropdown is populated instantly when opened instead of
  // waiting ~2-3s on the Eventbrite round-trip at click time.
  const [liveEvents, setLiveEvents] = useState<SummitEvent[]>(events)

  useEffect(() => {
    let cancelled = false
    fetchUpcomingEvents().then((fetched) => {
      if (!cancelled && fetched.length) setLiveEvents(fetched)
    })
    return () => {
      cancelled = true
    }
  }, [])

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
          events={liveEvents}
          selected={selected}
          onClose={() => setIsOpen(false)}
        />
      )}
    </RegistrationContext.Provider>
  )
}
