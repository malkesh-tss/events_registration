// Date & display helpers. All formatting is pinned to a fixed IANA timezone so
// server-rendered output matches client hydration (avoids hydration mismatches).

const TZ = 'America/Los_Angeles'

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

/** e.g. "Fri, Oct 2, 2026 · 12:00 PM PT" */
export function formatDateTime(iso: string, timezoneLabel = 'PT'): string {
  return `${formatDate(iso)} · ${formatTime(iso)} ${timezoneLabel}`
}

export function formatDuration(minutes: number): string {
  return `${minutes} mins`
}

export function formatPrice(priceCents?: number, isFree = false): string {
  if (isFree) return 'Free'
  if (typeof priceCents !== 'number') return ''
  return `$${(priceCents / 100).toFixed(0)}`
}
