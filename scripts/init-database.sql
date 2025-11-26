-- RAG Chatbot Database Schema
-- Enables pgvector extension and creates tables for documents, chunks, and embeddings

-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table: stores metadata about uploaded documents
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'pdf', 'txt', 'web', etc.
  file_size INTEGER,
  blob_url TEXT, -- Vercel Blob URL for original file
  upload_date TIMESTAMP DEFAULT NOW(),
  chunk_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chunks table: stores text chunks from documents with embeddings
CREATE TABLE IF NOT EXISTS chunks (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL, -- Order within document
  content TEXT NOT NULL, -- The actual text chunk
  token_count INTEGER, -- Number of tokens in chunk
  embedding vector(1536), -- OpenAI embedding (text-embedding-3-small = 1536 dimensions)
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index on document_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON chunks(document_id);

-- Create HNSW index for fast vector similarity search
-- HNSW (Hierarchical Navigable Small World) is optimized for high-dimensional vectors
CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Query history table: stores user queries and responses
CREATE TABLE IF NOT EXISTS query_history (
  id SERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  retrieved_chunks INTEGER[], -- Array of chunk IDs used
  retrieval_time_ms INTEGER,
  generation_time_ms INTEGER,
  total_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index on created_at for recent queries
CREATE INDEX IF NOT EXISTS idx_query_history_created_at ON query_history(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at on documents
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View for document statistics
CREATE OR REPLACE VIEW document_stats AS
SELECT
  d.id,
  d.name,
  d.file_type,
  d.chunk_count,
  COUNT(c.id) as actual_chunks,
  SUM(c.token_count) as total_tokens,
  d.upload_date,
  d.updated_at
FROM documents d
LEFT JOIN chunks c ON d.id = c.document_id
GROUP BY d.id, d.name, d.file_type, d.chunk_count, d.upload_date, d.updated_at
ORDER BY d.upload_date DESC;

-- Grant permissions (if needed for specific roles)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO neondb_owner;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO neondb_owner;

-- Insert test document to verify setup
INSERT INTO documents (name, file_type, file_size, metadata)
VALUES ('Test Document', 'txt', 100, '{"purpose": "database setup verification"}'::jsonb)
ON CONFLICT DO NOTHING;

SELECT 'Database schema created successfully!' as status;
SELECT 'pgvector extension: ' || extversion as pgvector_version FROM pg_extension WHERE extname = 'vector';
SELECT 'Tables created: ' || count(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';
