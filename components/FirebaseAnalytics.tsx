'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initAnalytics, trackGA } from '@/lib/analytics'

/**
 * Client-only Firebase Analytics mount point. Enables:
 *  - automatic `page_view` on every route change (visits)
 *  - global `ui_click` tracking for every button / link / [data-track] element
 * Renders nothing.
 */
export default function FirebaseAnalytics() {
  const pathname = usePathname()

  // Initialize Analytics once on the client.
  useEffect(() => {
    initAnalytics()
  }, [])

  // Log a page_view on the initial load and on every route change.
  useEffect(() => {
    if (typeof window === 'undefined') return
    trackGA('page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_referrer: document.referrer || undefined,
    })
  }, [pathname])

  // Global click tracking for all interactive elements.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const el = target?.closest<HTMLElement>(
        'a, button, [role="button"], [data-track]',
      )
      if (!el) return

      const text = (el.textContent || el.getAttribute('aria-label') || '').trim()
      const isAnchor = el instanceof HTMLAnchorElement
      const external = isAnchor && el.target === '_blank'

      trackGA('ui_click', {
        click_text: text.slice(0, 100) || undefined,
        click_tag: el.tagName.toLowerCase(),
        click_id: el.id || undefined,
        click_classes:
          typeof el.className === 'string'
            ? el.className.slice(0, 120)
            : undefined,
        click_href: isAnchor ? el.href : undefined,
        click_external: external || undefined,
        click_section: el.closest('section[id]')?.id || undefined,
        page_path: pathname,
      })
    }

    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [pathname])

  return null
}
