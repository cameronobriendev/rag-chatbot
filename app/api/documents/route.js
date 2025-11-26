import { getDB } from '../../../lib/db.js';

/**
 * GET /api/documents
 *
 * List all uploaded documents with metadata
 */
export async function GET(req) {
  try {
    const db = getDB();

    const documents = await db`
      SELECT
        id,
        name,
        file_type,
        file_size,
        chunk_count,
        upload_date,
        metadata
      FROM documents
      ORDER BY upload_date DESC
    `;

    return new Response(
      JSON.stringify({ documents }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Documents] Error fetching documents:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch documents' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
