import { withCsrf } from '../../../lib/csrf-middleware.js';
import { getDB } from '../../../lib/db.js';
import { extractTextFromPDF } from '../../../lib/pdf-extractor.js';
import { chunkText, estimateTokenCount } from '../../../lib/text-chunking.js';
import { generateEmbeddings } from '../../../lib/embeddings.js';

// Route configuration for larger file uploads
export const runtime = 'nodejs'; // Use Node.js runtime instead of Edge (supports larger payloads)
export const maxDuration = 60; // Allow up to 60 seconds for processing

/**
 * POST /api/upload
 *
 * Upload and process a document for RAG
 *
 * Flow:
 * 1. Receive base64 file data from frontend (sent as JSON, bypasses 4.5MB formData limit)
 * 2. Convert base64 to buffer
 * 3. Extract text (PDF or TXT)
 * 4. Chunk text (500 tokens with 50-token overlap)
 * 5. Generate embeddings for each chunk
 * 6. Store in database (documents + chunks tables)
 *
 * Returns: Document metadata with chunk count
 */
async function handler(req) {
  try {
    // Receive JSON with base64 file data
    const body = await req.json();
    const { fileData, fileName, fileSize, fileType } = body;

    if (!fileData || !fileName) {
      return new Response(
        JSON.stringify({ error: 'Missing fileData or fileName' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Upload] Processing file: ${fileName} (${fileSize} bytes)`);

    // Validate file size
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (fileSize > maxSize) {
      return new Response(
        JSON.stringify({ error: 'File too large (max 25MB)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(fileData, 'base64');
    console.log(`[Upload] Converted to buffer, size: ${buffer.length} bytes`);

    // Determine file type and extract text
    let text = '';
    let detectedFileType = '';

    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      console.log('[Upload] Detected PDF file, extracting text...');
      // Extract text from PDF
      const pdfData = await extractTextFromPDF(buffer);
      text = pdfData.text;
      detectedFileType = 'pdf';

      console.log(`[Upload] Extracted ${pdfData.pages} pages from PDF: ${fileName}`);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      // Extract text from TXT file
      text = buffer.toString('utf-8');
      detectedFileType = 'txt';

      console.log(`[Upload] Read text file: ${fileName}`);
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported file type. Please upload PDF or TXT files.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate extracted text
    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Could not extract text from file' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Upload] Extracted ${text.length} characters`);

    // Chunk text
    const chunks = chunkText(text, { chunkSize: 500, overlap: 50 });

    if (chunks.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Failed to chunk document text' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Upload] Created ${chunks.length} chunks`);

    // Generate embeddings for all chunks (batch processing)
    console.log('[Upload] Generating embeddings...');
    const embeddings = await generateEmbeddings(chunks);

    console.log(`[Upload] Generated ${embeddings.length} embeddings`);

    // Store in database
    const db = getDB();

    // Insert document metadata
    const documentResult = await db`
      INSERT INTO documents (name, file_type, file_size, chunk_count, metadata)
      VALUES (
        ${fileName},
        ${detectedFileType},
        ${fileSize},
        ${chunks.length},
        ${JSON.stringify({ uploadedAt: new Date().toISOString() })}
      )
      RETURNING id, name, file_type, chunk_count, upload_date
    `;

    const document = documentResult[0];

    console.log(`[Upload] Created document record: ${document.id}`);

    // Insert chunks with embeddings
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = embeddings[i];
      const tokenCount = estimateTokenCount(chunk);

      await db`
        INSERT INTO chunks (document_id, chunk_index, content, token_count, embedding)
        VALUES (
          ${document.id},
          ${i},
          ${chunk},
          ${tokenCount},
          ${JSON.stringify(embedding)}
        )
      `;
    }

    console.log(`[Upload] Stored ${chunks.length} chunks for document ${document.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        document: {
          id: document.id,
          name: document.name,
          fileType: document.file_type,
          chunkCount: document.chunk_count,
          uploadDate: document.upload_date
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Upload] Error processing document:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process document', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Export with CSRF protection
export const POST = withCsrf(handler);
