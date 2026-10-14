import { NextResponse } from 'next/server'
import { getRoundTableEvents } from '@/lib/api/eventbrite'

// GET /api/events/roundtables?limit=3
// Runs at request time (reads the request URL + hits Eventbrite/Neon).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(25, Math.max(1, Number(searchParams.get('limit')) || 3))

  const result = await getRoundTableEvents(limit)
  const status = result.source === 'none' && result.error ? 502 : 200
  return NextResponse.json(result, { status })
}
