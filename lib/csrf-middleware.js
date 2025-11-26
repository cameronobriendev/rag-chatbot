import { verifyCsrfToken } from './csrf.js';

/**
 * Middleware to verify CSRF tokens on state-changing requests
 *
 * Automatically checks POST, PUT, PATCH, DELETE requests for valid CSRF tokens.
 * Returns 403 if CSRF token is missing or invalid.
 *
 * Usage in API route:
 *   import { withCsrf } from '../../../lib/csrf-middleware.js';
 *
 *   async function handler(req) {
 *     // Your logic here
 *     return new Response(JSON.stringify({ success: true }), { status: 200 });
 *   }
 *
 *   export const POST = withCsrf(handler);
 */

export function withCsrf(handler) {
  return async (req) => {
    // Only check state-changing methods
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return await handler(req);
    }

    // Verify CSRF token
    const csrfValid = await verifyCsrfToken(req);
    if (!csrfValid) {
      console.error('[CSRF] Validation failed:', {
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString()
      });

      return new Response(
        JSON.stringify({
          error: 'Invalid CSRF token. Please refresh the page and try again.',
          code: 'CSRF_INVALID'
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // CSRF valid, continue to handler
    return await handler(req);
  };
}
