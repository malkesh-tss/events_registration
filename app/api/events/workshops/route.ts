import { NextResponse } from 'next/server'
import { getWorkshopEvents } from '@/lib/api/eventbrite'

// GET /api/events/workshops?limit=6
// Runs at request time (reads the request URL + hits Eventbrite/Neon).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(25, Math.max(1, Number(searchParams.get('limit')) || 6))

  const result = await getWorkshopEvents(limit)
  const status = result.source === 'none' && result.error ? 502 : 200
  return NextResponse.json(result, { status })
}
