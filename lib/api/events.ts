import type { SummitEvent, RoundtableEvent, WorkshopEvent } from '@/lib/types'

// In-memory data source for The Scale Summit catalog.
// Replace these helpers with a real database / Eventbrite import later — the
// page and API both read through these functions so the swap stays local.

// 12:00 PM PT during October (PDT, UTC-7) => 19:00 UTC.
export const roundtables: RoundtableEvent[] = [
  {
    id: 'rt-2026-10-02',
    format: 'roundtable',
    title: "Why Your Client Acquisition Isn't Working and How to Fix It",
    startsAt: '2026-10-02T19:00:00Z',
    durationMinutes: 60,
    timezoneLabel: 'PT',
    isFree: true,
    focus: 'Diagnosing bottlenecks in your client acquisition engine.',
    summary:
      'A free, weekly peer-driven discussion to pinpoint exactly where your client acquisition is breaking down — and what to do about it first.',
  },
  {
    id: 'rt-2026-10-08',
    format: 'roundtable',
    title: "Why Your Message Isn't Breaking Through And What to Do About It",
    startsAt: '2026-10-08T19:00:00Z',
    durationMinutes: 60,
    timezoneLabel: 'PT',
    isFree: true,
    focus: 'Fixing confusing, commodity messaging.',
    summary:
      'Bring your current messaging and leave with clarity on why prospects are glazing over — and how to make them lean in.',
  },
  {
    id: 'rt-2026-10-23',
    format: 'roundtable',
    title: 'How to Differentiate to Stand Out',
    startsAt: '2026-10-23T19:00:00Z',
    durationMinutes: 60,
    timezoneLabel: 'PT',
    isFree: true,
    focus: 'Escaping commodity positioning.',
    summary:
      'Trade war stories and get sharp feedback on how to position your firm so you stop getting compared on price.',
  },
  {
    id: 'rt-2026-10-30',
    format: 'roundtable',
    title: "Why Your Client Acquisition Isn't Working and How to Fix It",
    startsAt: '2026-10-30T19:00:00Z',
    durationMinutes: 60,
    timezoneLabel: 'PT',
    isFree: true,
    focus: 'Diagnosing bottlenecks in your client acquisition engine.',
    summary:
      'A free, weekly peer-driven discussion to pinpoint exactly where your client acquisition is breaking down — and what to do about it first.',
  },
]

export const workshops: WorkshopEvent[] = [
  {
    id: 'ws-2026-10-16',
    format: 'workshop',
    title: 'How Trusted Advisors Win More Business',
    startsAt: '2026-10-16T19:00:00Z',
    durationMinutes: 90,
    timezoneLabel: 'PT',
    isFree: false,
    priceCents: 9900,
    featured: true,
    framework: 'Establish, Earn, Elevate',
    problem:
      "Prospects are comparing you on price and treating your services like a commodity — so every deal turns into a discount negotiation.",
    takeaways: [
      'Reframe the conversation from cost to outcomes so price stops being the deciding factor.',
      'Apply the Establish, Earn, Elevate framework to your next discovery call.',
      'Turn one-off projects into recurring advisory relationships.',
      'Package and price your expertise as a premium, trusted-advisor offer.',
      'Walk away with a playbook to raise your close rate without cutting rates.',
    ],
    summary:
      'A 90-minute, hands-on workshop where you apply the "Establish, Earn, Elevate" framework directly to your pipeline — and leave with a working plan, not just notes.',
  },
  {
    id: 'ws-2026-08-messaging-mistakes',
    format: 'workshop',
    title: 'The Messaging Mistakes Costing You Clients',
    startsAt: '2026-08-14T19:00:00Z',
    durationMinutes: 90,
    timezoneLabel: 'PT',
    isFree: false,
    priceCents: 9900,
    summary:
      'A past favorite: the common messaging errors that make founders sound like everyone else — and the fixes that make you the obvious choice.',
  },
  {
    id: 'ws-2026-07-discovery-call',
    format: 'workshop',
    title: 'Discovery Call Conversion',
    startsAt: '2026-07-17T19:00:00Z',
    durationMinutes: 90,
    timezoneLabel: 'PT',
    isFree: false,
    priceCents: 9900,
    summary:
      'Turn first calls into signed engagements with a structured discovery approach that surfaces real pain and positions you as the solution.',
  },
  {
    id: 'ws-2026-06-niching-paradox',
    format: 'workshop',
    title: 'The Niching Paradox',
    startsAt: '2026-06-12T19:00:00Z',
    durationMinutes: 90,
    timezoneLabel: 'PT',
    isFree: false,
    priceCents: 9900,
    summary:
      'Why going narrower makes you bigger — how to niche down without capping your growth or boxing yourself in.',
  },
]

export const allEvents: SummitEvent[] = [...roundtables, ...workshops]

export function getEvents(): SummitEvent[] {
  return allEvents
}

export function getEventById(id: string): SummitEvent | undefined {
  return allEvents.find((event) => event.id === id)
}

export function getRoundtables(): RoundtableEvent[] {
  return roundtables
}

export function getFeaturedWorkshop(): WorkshopEvent | undefined {
  return workshops.find((workshop) => workshop.featured)
}

/** Upcoming paid workshops, featured first, then most recent. */
export function getWorkshops(): WorkshopEvent[] {
  return [...workshops].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  })
}
