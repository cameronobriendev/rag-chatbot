import { getDB } from '../../../lib/db.js';
import { generateEmbedding } from '../../../lib/embeddings.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * POST /api/chat
 *
 * RAG Query Endpoint
 *
 * Flow:
 * 1. User asks a question
 * 2. Generate embedding for question
 * 3. Vector similarity search (retrieve top 5 relevant chunks)
 * 4. Build prompt with retrieved context
 * 5. GPT-4 generates answer
 * 6. Log query + response
 * 7. Return response with source citations
 */
export async function POST(req) {
  const startTime = Date.now();

  try {
    const { query, sessionId } = await req.json();

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Chat] Query from session ${sessionId}:`, query);

    // Step 1: Generate embedding for user question
    console.log('[Chat] Generating query embedding...');
    const queryEmbeddingStart = Date.now();
    const queryEmbedding = await generateEmbedding(query);
    const queryEmbeddingTime = Date.now() - queryEmbeddingStart;

    console.log(`[Chat] Query embedding generated in ${queryEmbeddingTime}ms`);

    // Step 2: Vector similarity search (retrieve top 5 chunks)
    console.log('[Chat] Searching for relevant chunks...');
    const retrievalStart = Date.now();

    const db = getDB();

    // Use pgvector cosine similarity to find most relevant chunks
    // <=> is the cosine distance operator in pgvector
    // Filter by session_id to isolate user's documents
    const queryResult = await db`
      SELECT
        c.id,
        c.content,
        c.document_id,
        d.name as document_name,
        1 - (c.embedding <=> ${JSON.stringify(queryEmbedding)}) as similarity
      FROM chunks c
      JOIN documents d ON c.document_id = d.id
      WHERE d.session_id = ${sessionId}
      ORDER BY c.embedding <=> ${JSON.stringify(queryEmbedding)}
      LIMIT 5
    `;

    const results = queryResult.rows;
    const retrievalTime = Date.now() - retrievalStart;

    console.log(`[Chat] Found ${results.length} relevant chunks in ${retrievalTime}ms`);

    if (results.length === 0) {
      return new Response(
        JSON.stringify({
          response: 'I don\'t have enough information to answer that question. Please upload documents first.',
          sources: [],
          metadata: {
            retrievalTime: retrievalTime,
            generationTime: 0,
            totalTime: Date.now() - startTime
          }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 3: Build context from retrieved chunks
    const context = results
      .map((r, i) => `[${i + 1}] From "${r.document_name}":\n${r.content}`)
      .join('\n\n---\n\n');

    console.log('[Chat] Context built from', results.length, 'chunks');

    // Step 4: Generate response using GPT-4
    console.log('[Chat] Generating response with GPT-4...');
    const generationStart = Date.now();

    const systemPrompt = `You are a helpful AI assistant that answers questions based on the provided context.
Your answers should be accurate, concise, and directly reference the context when appropriate.
If the context doesn't contain enough information to fully answer the question, say so clearly.
Always cite which source(s) you're referencing in your answer using [1], [2], etc.`;

    const userPrompt = `Context from documents:

${context}

---

Question: ${query}

Answer the question based on the context above. If you reference specific information, cite the source using [1], [2], etc.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;
    const generationTime = Date.now() - generationStart;
    const totalTime = Date.now() - startTime;

    console.log(`[Chat] Response generated in ${generationTime}ms (total: ${totalTime}ms)`);

    // Step 5: Log query history
    const chunkIds = results.map(r => r.id);

    await db`
      INSERT INTO query_history (
        query,
        response,
        retrieved_chunks,
        retrieval_time_ms,
        generation_time_ms,
        total_time_ms
      )
      VALUES (
        ${query},
        ${response},
        ${chunkIds},
        ${retrievalTime},
        ${generationTime},
        ${totalTime}
      )
    `;

    // Step 6: Return response with sources
    const sources = results.map((r, i) => ({
      index: i + 1,
      documentName: r.document_name,
      documentId: r.document_id,
      similarity: parseFloat(r.similarity.toFixed(3)),
      preview: r.content.substring(0, 150) + (r.content.length > 150 ? '...' : '')
    }));

    return new Response(
      JSON.stringify({
        response,
        sources,
        metadata: {
          retrievalTime,
          generationTime,
          totalTime,
          chunksRetrieved: results.length
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Chat] Error processing query:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process query',
        details: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
