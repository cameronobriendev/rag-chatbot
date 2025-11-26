import { createSql } from '@vercel/postgres';

/**
 * Database client utility
 *
 * Uses @vercel/postgres with pooled connections to Neon
 * Manually configured to use DATABASE_POSTGRES_URL or DATABASE_URL from Neon integration
 */

// Vercel Postgres looks for POSTGRES_URL, but Neon provides DATABASE_URL
// So we manually configure it with the Neon-provided env var
const connectionString = process.env.DATABASE_POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;

const sql = createSql({
  connectionString
});

export function getDB() {
  return sql;
}

/**
 * Direct export for convenience
 */
export const db = sql;
