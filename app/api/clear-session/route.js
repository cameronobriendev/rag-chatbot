import { withCsrf } from '../../../lib/csrf-middleware.js';
import { getDB } from '../../../lib/db.js';

/**
 * POST /api/clear-session
 *
 * Delete all documents and chunks for a user's session
 * This gives users control over their data
 */
async function handler(req) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Clear Session] Deleting all data for session: ${sessionId}`);

    const db = getDB();

    // Delete all documents for this session
    // ON DELETE CASCADE will automatically delete associated chunks
    const result = await db`
      DELETE FROM documents
      WHERE session_id = ${sessionId}
      RETURNING id
    `;

    const deletedCount = result.length;

    console.log(`[Clear Session] Deleted ${deletedCount} documents (and their chunks)`);

    return new Response(
      JSON.stringify({
        success: true,
        deletedDocuments: deletedCount,
        message: 'All your data has been deleted'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Clear Session] Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to clear session data',
        details: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Export with CSRF protection
export const POST = withCsrf(handler);
