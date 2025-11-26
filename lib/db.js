import { sql } from '@vercel/postgres';

/**
 * Database client utility
 *
 * Uses @vercel/postgres with pooled connections to Neon
 * Automatically uses POSTGRES_URL or DATABASE_URL from environment
 */

export function getDB() {
  return sql;
}

/**
 * Helper to execute raw SQL with parameterized queries
 * Always use tagged templates to prevent SQL injection
 *
 * Example:
 *   const db = getDB();
 *   const results = await db`SELECT * FROM documents WHERE id = ${documentId}`;
 */
export { sql as db };
