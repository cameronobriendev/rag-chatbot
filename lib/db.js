import { createPool } from '@vercel/postgres';

/**
 * Database client utility
 *
 * Uses @vercel/postgres with pooled connections to Neon
 * Uses DATABASE_POSTGRES_URL or DATABASE_URL from environment (Neon integration vars)
 */

// Use existing Neon environment variables
const connectionString = process.env.DATABASE_POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Database connection string not found. Need DATABASE_POSTGRES_URL or DATABASE_URL');
}

const pool = createPool({
  connectionString
});

export function getDB() {
  return pool.sql;
}

/**
 * Direct export for convenience
 */
export const db = pool.sql;
