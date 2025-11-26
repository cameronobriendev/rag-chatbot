import { sql } from '@vercel/postgres';

/**
 * Database client utility
 *
 * Uses @vercel/postgres with pooled connections to Neon
 * Automatically uses DATABASE_POSTGRES_URL, DATABASE_URL, or POSTGRES_URL from environment
 */

export function getDB() {
  return sql;
}

/**
 * Direct export for convenience
 */
export const db = sql;
