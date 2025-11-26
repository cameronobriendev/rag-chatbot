// Route configuration for larger file uploads
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

/**
 * POST /api/upload
 *
 * Proxy endpoint that forwards uploads to Digital Ocean
 * This solves the mixed content issue (HTTPS → HTTP)
 *
 * Browser (HTTPS) → Vercel (HTTPS) → Digital Ocean (HTTP) ✅
 * Browser (HTTPS) → Digital Ocean (HTTP) ❌ Blocked by browser
 */
export async function POST(req) {
  try {
    // Get request body
    const body = await req.json();

    console.log(`[Upload Proxy] Forwarding request to Digital Ocean...`);

    // Forward to Digital Ocean upload service
    const doResponse = await fetch('http://143.110.154.10:3006/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await doResponse.json();

    console.log(`[Upload Proxy] DO responded with status: ${doResponse.status}`);

    return new Response(
      JSON.stringify(data),
      {
        status: doResponse.status,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('[Upload Proxy] Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process upload',
        details: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
