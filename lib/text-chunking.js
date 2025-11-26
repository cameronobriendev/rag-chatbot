/**
 * Text Chunking Utilities
 *
 * Splits documents into smaller chunks for embedding and retrieval
 * Strategy: Fixed-size chunks with overlap to preserve context
 */

/**
 * Estimate token count (rough approximation)
 * OpenAI uses ~4 characters per token for English text
 *
 * @param {string} text - Text to count tokens for
 * @returns {number} - Estimated token count
 */
export function estimateTokenCount(text) {
  return Math.ceil(text.length / 4);
}

/**
 * Split text into chunks with overlap
 *
 * @param {string} text - Full document text
 * @param {object} options - Chunking options
 * @param {number} options.chunkSize - Target tokens per chunk (default: 500)
 * @param {number} options.overlap - Tokens to overlap between chunks (default: 50)
 * @returns {string[]} - Array of text chunks
 */
export function chunkText(text, options = {}) {
  const { chunkSize = 500, overlap = 50 } = options;

  // Convert token sizes to approximate character counts
  const chunkCharSize = chunkSize * 4;
  const overlapCharSize = overlap * 4;

  // Clean text (normalize whitespace)
  const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (cleanedText.length === 0) {
    return [];
  }

  // If text is shorter than chunk size, return as single chunk
  if (cleanedText.length <= chunkCharSize) {
    return [cleanedText];
  }

  const chunks = [];
  let start = 0;

  while (start < cleanedText.length) {
    let end = start + chunkCharSize;

    // If this is not the last chunk, try to break at a sentence boundary
    if (end < cleanedText.length) {
      // Look for sentence endings near the target position
      const searchStart = Math.max(start, end - 200);
      const searchText = cleanedText.slice(searchStart, end + 200);

      // Find sentence boundaries (period, question mark, exclamation)
      const sentenceMatch = searchText.match(/[.!?]\s/g);

      if (sentenceMatch) {
        // Find the last sentence boundary before our target
        const lastMatch = searchText.lastIndexOf(sentenceMatch[sentenceMatch.length - 1]);
        if (lastMatch !== -1) {
          end = searchStart + lastMatch + 2; // +2 to include punctuation and space
        }
      } else {
        // No sentence boundary found, try to break at paragraph
        const paragraphMatch = cleanedText.lastIndexOf('\n\n', end);
        if (paragraphMatch > start) {
          end = paragraphMatch + 2;
        } else {
          // No paragraph break, try to break at space
          const spaceMatch = cleanedText.lastIndexOf(' ', end);
          if (spaceMatch > start) {
            end = spaceMatch + 1;
          }
        }
      }
    }

    // Extract chunk
    const chunk = cleanedText.slice(start, end).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Move start position (with overlap)
    start = end - overlapCharSize;

    // Ensure we make progress even if overlap is large
    if (start <= chunks[chunks.length - 1]?.length) {
      start = end;
    }
  }

  return chunks;
}

/**
 * Split text into semantic sections (by paragraphs, then chunk if needed)
 *
 * @param {string} text - Full document text
 * @param {number} maxChunkSize - Maximum tokens per chunk (default: 500)
 * @returns {string[]} - Array of text chunks
 */
export function chunkByParagraphs(text, maxChunkSize = 500) {
  const maxCharSize = maxChunkSize * 4;

  // Split by double newlines (paragraphs)
  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 0);

  const chunks = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed max size, save current chunk
    if (currentChunk.length + paragraph.length > maxCharSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }

    // If single paragraph exceeds max size, split it
    if (paragraph.length > maxCharSize) {
      // Save any accumulated text first
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      // Split the long paragraph
      const subChunks = chunkText(paragraph, { chunkSize: maxChunkSize, overlap: 50 });
      chunks.push(...subChunks);
    } else {
      // Add paragraph to current chunk
      currentChunk += (currentChunk.length > 0 ? '\n\n' : '') + paragraph;
    }
  }

  // Add final chunk
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
