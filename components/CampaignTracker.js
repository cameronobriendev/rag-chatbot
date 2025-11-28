'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function CampaignTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Get campaign cookies
    const getCookie = (name) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
      return null
    }

    const campaignClient = getCookie('__campaign_client')
    const campaignSession = getCookie('__campaign_session')

    // Only track if we have a campaign cookie
    if (campaignClient && campaignSession) {
      // Send Umami event
      if (window.umami) {
        window.umami.track('campaign-pageview', {
          client: campaignClient,
          session: campaignSession,
          page: window.location.hostname + pathname,
          timestamp: new Date().toISOString()
        })
      }

      // Send to main portfolio API for aggregation
      fetch('https://www.cameronobrien.dev/api/campaigns/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client: campaignClient,
          session: campaignSession,
          page: window.location.hostname + pathname,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.error('Campaign tracking error:', err))
    }
  }, [pathname])

  return null // This component doesn't render anything
}
