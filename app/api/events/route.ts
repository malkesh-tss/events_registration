import { NextResponse } from 'next/server'
import { getEvents } from '@/lib/api/events'

// GET /api/events?format=roundtable|workshop
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format')

  const events = getEvents().filter((event) =>
    format ? event.format === format : true,
  )

  return NextResponse.json({ events })
}
