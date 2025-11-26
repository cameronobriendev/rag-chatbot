import { sql } from '@vercel/postgres';

/**
 * Database client utility
 *
 * Uses @vercel/postgres with pooled connections to Neon
 * Ensures POSTGRES_URL is set from Neon's DATABASE_URL at runtime
 */

let initialized = false;

function ensurePostgresUrl() {
  if (!initialized) {
    // @vercel/postgres expects POSTGRES_URL, but Neon provides DATABASE_URL
    // Set it at runtime if not already set
    if (!process.env.POSTGRES_URL) {
      const connectionString = process.env.DATABASE_POSTGRES_URL || process.env.DATABASE_URL;

      if (!connectionString) {
        throw new Error('Database connection string not found. Need DATABASE_POSTGRES_URL or DATABASE_URL');
      }

      process.env.POSTGRES_URL = connectionString;
      console.log('[DB] Set POSTGRES_URL from DATABASE_URL');
    }
    initialized = true;
  }
}

export function getDB() {
  ensurePostgresUrl();
  return sql;
}

/**
 * Direct export for convenience
 */
export const db = new Proxy({}, {
  get(target, prop) {
    ensurePostgresUrl();
    return sql[prop];
  }
});
