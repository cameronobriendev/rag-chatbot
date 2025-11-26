import { handleUpload } from '@vercel/blob';

export const runtime = 'nodejs';

/**
 * POST /api/blob-upload-url
 *
 * Generate a signed upload URL for client-side Blob uploads
 * This keeps the BLOB_READ_WRITE_TOKEN secret on the server
 */
export async function POST(req) {
  try {
    const jsonResponse = await handleUpload({
      body: await req.json(),
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // Validate file types
        if (!pathname.endsWith('.pdf') && !pathname.endsWith('.txt')) {
          throw new Error('Only PDF and TXT files are allowed');
        }

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

    return Response.json(jsonResponse);
  } catch (error) {
    console.error('[Blob Upload URL] Error:', error);
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
