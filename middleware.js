import { NextResponse } from 'next/server'

export function middleware(request) {
  const hostname = request.headers.get('host')
  const url = new URL(request.url)

  // Check for campaign tracking parameter (?client=XXX)
  const clientParam = url.searchParams.get('client')

  let response

  // If accessing sm.cameronobrien.dev, serve the scriptmatix proposal
  if (hostname === 'sm.cameronobrien.dev') {
    response = NextResponse.rewrite(new URL('/scriptmatix-proposal.html', request.url))

    // Add custom header for analytics
    response.headers.set('x-subdomain', 'sm')
    response.headers.set('x-page', 'scriptmatix-proposal')

    // Log to Vercel (will show in dashboard logs)
    console.log('ScriptMatix proposal view:', {
      subdomain: hostname,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      country: request.geo?.country || 'unknown',
      city: request.geo?.city || 'unknown'
    })
  } else {
    response = NextResponse.next()
  }

  // Campaign tracking: Set cookie if ?client=XXX is present
  if (clientParam) {
    // Create a tracking session ID
    const sessionId = `${clientParam}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Set cookie for 30 days - CRITICAL: domain must work across all subdomains
    response.cookies.set('__campaign_client', clientParam, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: false, // Need client-side access for tracking
      secure: true,
      sameSite: 'lax',
      domain: '.cameronobrien.dev', // Works on all subdomains (sm.*, www.*, etc)
      path: '/'
    })

    response.cookies.set('__campaign_session', sessionId, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      domain: '.cameronobrien.dev', // Works on all subdomains
      path: '/'
    })

    // Log campaign click
    console.log('Campaign click:', {
      client: clientParam,
      sessionId,
      timestamp: new Date().toISOString(),
      page: url.pathname,
      userAgent: request.headers.get('user-agent')
    })
  }

  return response
}

export const config = {
  matcher: ['/', '/:path*'], // Match all paths
}
