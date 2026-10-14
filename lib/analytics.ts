'use client'

import {
  initializeAnalytics,
  isSupported,
  logEvent,
  type Analytics,
} from 'firebase/analytics'
import { firebaseApp } from '@/lib/firebase'

let ga: Analytics | null = null
let initStarted = false

/**
 * Initialize Firebase Analytics once, on the client, and only when the browser
 * supports it. Disables the SDK's automatic page_view so route-change page
 * views (logged in <FirebaseAnalytics/>) are not double-counted.
 */
export async function initAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null
  if (initStarted) return ga
  initStarted = true
  try {
    if (await isSupported()) {
      ga = initializeAnalytics(firebaseApp, {
        config: { send_page_view: false },
      })
    }
  } catch {
    ga = null
  }
  return ga
}

/**
 * Log a Firebase/GA4 event from the browser. Lazily initializes Analytics if a
 * call happens before the mount-time init has resolved. No-op on the server or
 * when Analytics is unsupported.
 */
export function trackGA(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  if (ga) {
    logEvent(ga, event, params)
    return
  }
  initAnalytics().then((instance) => {
    if (instance) logEvent(instance, event, params)
  })
}
