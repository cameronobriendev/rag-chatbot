import { generateCsrfToken, createCsrfCookie } from '../../../lib/csrf.js';

/**
 * GET /api/csrf-token
 *
 * Returns a CSRF token for use in state-changing requests
 * Sets HttpOnly cookie and returns token in response body
 */
export async function GET(req) {
  try {
    const { token } = generateCsrfToken();

    return new Response(
      JSON.stringify({ csrfToken: token }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': createCsrfCookie(token)
        }
      }
    );
  } catch (error) {
    console.error('[CSRF Token] Error generating token:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate CSRF token' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
