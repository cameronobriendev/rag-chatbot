import { handleUpload } from '@vercel/blob/client';

export const runtime = 'nodejs';

/**
 * POST /api/blob-upload-url
 *
 * Generate a signed upload URL for client-side Blob uploads
 * This keeps the BLOB_READ_WRITE_TOKEN secret on the server
 */
export async function POST(req) {
  try {
    const body = await req.json();

    return handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // You can add validation here if needed
        return {
          allowedContentTypes: ['application/pdf', 'text/plain'],
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Optional: Log upload completion
        console.log('[Blob Upload] File uploaded:', blob.url);
      },
    });
  } catch (error) {
    console.error('[Blob Upload URL] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
