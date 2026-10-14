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
    durationMinutes: 60,
    timezoneLabel: 'PDT',
    isFree: true,
    featured: true,
    upcoming: true,
    framework: 'Establish, Earn, Elevate',
    focus:
      'Establish, Earn, Elevate: Become the obvious choice and win business without competing on price.',
    problem:
      "Expertise alone doesn't make you the obvious choice. Prospects buy on emotion and justify with logic. If you are treated like a commodity vendor who simply completes the job, your acquisition strategy is stuck.",
    explore: [
      'How to demonstrate domain expertise so prospects feel you understand their world.',
      'Why selling experience falls short and what to show instead.',
      'How to turn sales conversations into an advisory experience that builds confidence.',
      'How to guide prospects to the right solution without pushing for the sale.',
    ],
    takeaway:
      'Walk out with a clear framework (Establish, Earn, Elevate) to apply directly to your brand, sales pitch, and client relationships.',
    summary:
      'A 60-minute interactive working session where you apply the "Establish, Earn, Elevate" framework directly to your brand, sales pitch, and client relationships.',
  },
  {
    id: 'ws-2026-09-messaging-mistake',
    format: 'workshop',
    title: "The Messaging Mistake That's Costing You Leads",
    startsAt: '2026-09-11T19:00:00Z',
    durationMinutes: 60,
    timezoneLabel: 'PDT',
    isFree: true,
    framework: 'Brand vs. Lead Gen Messaging',
    focus:
      'Brand vs. Lead Gen Messaging: Learn how to build messaging on engagement to drive sales conversations.',
    summary:
      'The common messaging errors that make founders sound like everyone else — and the fixes that make you the obvious choice.',
  },
  {
    id: 'ws-2026-08-discovery-calls',
    format: 'workshop',
    title: 'Turn Discovery Calls into Closed Deals',
    startsAt: '2026-08-14T19:00:00Z',
    durationMinutes: 60,
    timezoneLabel: 'PDT',
    isFree: true,
    framework: 'Courtroom Sales Structure',
    focus: 'Courtroom Sales Structure: Turn discovery calls into a compelling closing argument.',
    summary:
      'Turn first calls into signed engagements with a structured discovery approach that surfaces real pain and positions you as the solution.',
  },
  {
    id: 'ws-2026-07-empty-pipeline',
    format: 'workshop',
    title: 'Unclear Brand = Empty Pipeline',
    startsAt: '2026-07-17T19:00:00Z',
    durationMinutes: 60,
    timezoneLabel: 'PDT',
    isFree: true,
    framework: '1–2 Word Brand Focus',
    focus:
      '1–2 Word Brand Focus: Uncover your core brand words to eliminate confusion and attract buyers.',
    summary:
      'Uncover your core brand words to eliminate confusion and attract the buyers who are right for you.',
  },
  {
    id: 'ws-2026-06-revolutionize-discovery',
    format: 'workshop',
    title: 'Revolutionize Your Discovery Call',
    startsAt: '2026-06-12T19:00:00Z',
    durationMinutes: 60,
    timezoneLabel: 'PDT',
    isFree: true,
    framework: '6-Question Uncovering Pain Sequence',
    focus:
      '6-Question Uncovering Pain Sequence: Collaborate with prospects to eliminate price objections early.',
    summary:
      'Collaborate with prospects to eliminate price objections early using a 6-question uncovering pain sequence.',
  },
  {
    id: 'ws-2026-05-niching-paradox',
    format: 'workshop',
    title: 'The Niching Paradox Workshop',
    startsAt: '2026-05-15T19:00:00Z',
    durationMinutes: 60,
    timezoneLabel: 'PDT',
    isFree: true,
    framework: '3-Question Niche Filter',
    focus:
      '3-Question Niche Filter: Narrow your audience to increase conversions and pricing power.',
    summary:
      'Why going narrower makes you bigger — how to niche down without capping your growth or boxing yourself in.',
  },
  {
    id: 'ws-2026-05-ai-client-acquisition',
    format: 'workshop',
    title: 'How to Prompt AI for Client Acquisition',
    startsAt: '2026-05-21T19:00:00Z',
    durationMinutes: 60,
    timezoneLabel: 'PDT',
    isFree: true,
    framework: 'AI Messaging Strategy',
    focus:
      'AI Messaging Strategy: Prompt AI to build differentiated brand and lead gen messaging.',
    summary:
      'Prompt AI to build differentiated brand and lead gen messaging for your business.',
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

/** Workshops, featured/upcoming first, then by date. */
export function getWorkshops(): WorkshopEvent[] {
  return [...workshops].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  })
}
