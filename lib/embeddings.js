import OpenAI from 'openai';

/**
 * OpenAI Embeddings Utility
 *
 * Generates 1536-dimensional embeddings using text-embedding-3-small
 * Cost: ~$0.02 per 1M tokens (very cheap)
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate embedding for a single text chunk
 *
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} - 1536-dimensional embedding vector
 */
export async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float'
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('[Embeddings] Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Generate embeddings for multiple text chunks (batch processing)
 *
 * @param {string[]} texts - Array of texts to embed
 * @returns {Promise<number[][]>} - Array of 1536-dimensional embedding vectors
 */
export async function generateEmbeddings(texts) {
  try {
    // OpenAI allows up to 2048 inputs per request
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
      encoding_format: 'float'
    });

    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('[Embeddings] Error generating embeddings:', error);
    throw new Error('Failed to generate embeddings');
  }
}

/**
 * Calculate cosine similarity between two vectors
 * (For testing/debugging - Postgres pgvector handles this in production)
 *
 * @param {number[]} a - First vector
 * @param {number[]} b - Second vector
 * @returns {number} - Similarity score (0-1, higher = more similar)
 */
export function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (magnitudeA * magnitudeB);
}
