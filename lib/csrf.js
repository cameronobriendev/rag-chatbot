/**
 * CSRF Token Security
 *
 * Double-submit cookie pattern:
 * - Token stored in HttpOnly cookie
 * - Token sent in X-CSRF-Token header
 * - Both must match for request to proceed
 * - Cryptographically secure random bytes (Web Crypto API)
 */

export function generateCsrfToken() {
  // Generate 32-byte random token using Web Crypto API (Edge Runtime compatible)
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);

  // Convert to base64url format (URL-safe)
  const token = btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return {
    token: token,
    expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
  };
}

export function createCsrfCookie(token) {
  const maxAge = 60 * 60; // 1 hour in seconds

  // For portfolio project: use current domain, no shared domain cookies needed
  return `csrf_token=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Strict${
    process.env.NODE_ENV === 'production' ? '; Secure' : ''
  }`;
}

export async function verifyCsrfToken(req) {
  // Allow bypass in development if CSRF enforcement is disabled
  if (process.env.ENFORCE_CSRF === 'false') {
    return true;
  }

  // Get token from header
  const headerToken = req.headers.get('x-csrf-token');

  // Get token from cookie
  const cookies = req.headers.get('cookie') || '';
  const cookieToken = cookies
    .split(';')
    .find(c => c.trim().startsWith('csrf_token='))
    ?.split('=')[1];

  if (!headerToken || !cookieToken) {
    console.log('[CSRF] Missing token in header or cookie');
    return false;
  }

  // Compare tokens (constant-time comparison to prevent timing attacks)
  if (headerToken.length !== cookieToken.length) {
    console.log('[CSRF] Token length mismatch');
    return false;
  }

  let diff = 0;
  for (let i = 0; i < headerToken.length; i++) {
    diff |= headerToken.charCodeAt(i) ^ cookieToken.charCodeAt(i);
  }

  if (diff !== 0) {
    console.log('[CSRF] Token mismatch');
    return false;
  }

  return true;
}
