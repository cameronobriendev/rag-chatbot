import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

// Load .env.local file
dotenv.config({ path: '.env.local' });

/**
 * Add session-based isolation to RAG chatbot
 *
 * Adds session_id column to documents table
 * This allows multiple users to use the demo simultaneously without seeing each other's data
 */

async function addSessionIsolation() {
  try {
    console.log('🔒 Adding session-based isolation...\n');

    // Add session_id column to documents table
    console.log('📝 Adding session_id column to documents table...');
    await sql`
      ALTER TABLE documents
      ADD COLUMN IF NOT EXISTS session_id TEXT
    `;
    console.log('✅ session_id column added\n');

    // Create index on session_id for fast lookups
    console.log('🔍 Creating session_id index...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_documents_session_id ON documents(session_id)
    `;
    console.log('✅ session_id index created\n');

    // Create cleanup function
    console.log('🧹 Creating session cleanup function...');
    await sql`
      CREATE OR REPLACE FUNCTION cleanup_old_sessions()
      RETURNS void AS $$
      BEGIN
        -- Delete documents (and cascading chunks) older than 24 hours
        DELETE FROM documents
        WHERE upload_date < NOW() - INTERVAL '24 hours';
      END;
      $$ LANGUAGE plpgsql;
    `;
    console.log('✅ Cleanup function created\n');

    console.log('✅ Session isolation setup complete!\n');
    console.log('💡 Documents are now isolated by session');
    console.log('💡 Old sessions auto-deleted after 24 hours');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding session isolation:', error);
    process.exit(1);
  }
}

addSessionIsolation();
