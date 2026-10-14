// Zoom Server-to-Server OAuth client.
// Env: ZOOM_ACCOUNT_ID + (ZOOM_BASIC_AUTH or ZOOM_CLIENT_ID/ZOOM_CLIENT_SECRET).

export class ZoomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ZoomError'
  }
}

interface ZoomMeeting {
  id: string | number
  topic?: string
  start_time?: string
}

interface ZoomMeetingsResponse {
  meetings?: ZoomMeeting[]
  next_page_token?: string
}

interface ZoomRegistrantResponse {
  registrant_id?: string
  join_url?: string
  start_url?: string
}

export class ZoomClient {
  private async getAccessToken(): Promise<string> {
    const accountId = process.env.ZOOM_ACCOUNT_ID
    const tokenUrl = process.env.ZOOM_TOKEN_URL ?? 'https://zoom.us/oauth/token'
    const basicAuth = process.env.ZOOM_BASIC_AUTH
    const clientId = process.env.ZOOM_CLIENT_ID
    const clientSecret = process.env.ZOOM_CLIENT_SECRET

    if (!accountId || (!basicAuth && (!clientId || !clientSecret))) {
      throw new ZoomError(
        'Zoom is not configured. Set ZOOM_ACCOUNT_ID and either ZOOM_BASIC_AUTH or ZOOM_CLIENT_ID plus ZOOM_CLIENT_SECRET.',
      )
    }

    const authorization =
      basicAuth ?? Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const response = await fetch(
      `${tokenUrl}?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authorization}`,
          'Content-Type': 'application/json',
        },
      },
    )

    const data = (await response.json()) as {
      access_token?: string
      reason?: string
    }
    if (!response.ok || !data.access_token) {
      throw new ZoomError(
        `Zoom authentication failed: ${data.reason ?? response.statusText}`,
      )
    }

    return data.access_token
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`https://api.zoom.us/v2${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${await this.getAccessToken()}`,
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })
    const data = (await response.json()) as T & { message?: string }

    if (!response.ok) {
      throw new ZoomError(
        `Zoom request failed: ${data.message ?? response.statusText}`,
      )
    }

    return data
  }

  async findMeeting(title: string, startAt: Date): Promise<string> {
    let nextPageToken = ''
    const targetTime = startAt.getTime()

    do {
      const query = new URLSearchParams({ type: 'scheduled', page_size: '300' })
      if (nextPageToken) query.set('next_page_token', nextPageToken)
      const data = await this.request<ZoomMeetingsResponse>(
        `/users/me/meetings?${query}`,
      )

      const meeting = (data.meetings ?? []).find((candidate) => {
        if (candidate.topic !== title || !candidate.start_time) return false
        return (
          Math.abs(new Date(candidate.start_time).getTime() - targetTime) <=
          90_000
        )
      })

      if (meeting) return String(meeting.id)
      nextPageToken = data.next_page_token ?? ''
    } while (nextPageToken)

    throw new ZoomError(
      'No matching Zoom meeting was found for this event.',
    )
  }

  registerAttendee(
    meetingId: string,
    firstName: string,
    lastName: string,
    email: string,
  ) {
    return this.request<ZoomRegistrantResponse>(
      `/meetings/${encodeURIComponent(meetingId)}/registrants`,
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
        }),
      },
    )
  }
}
