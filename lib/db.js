import { createPool } from '@vercel/postgres';

/**
 * Database client utility
 *
 * Uses @vercel/postgres with pooled connections to Neon
 * Manually configured to use DATABASE_POSTGRES_URL or DATABASE_URL from Neon integration
 */

let pool;
let sql;

function initPool() {
  if (!pool) {
    // Vercel Postgres looks for POSTGRES_URL, but Neon provides DATABASE_URL
    // So we manually configure it with the Neon-provided env var
    const connectionString = process.env.DATABASE_POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (!connectionString) {
      throw new Error('Database connection string not found. Need DATABASE_POSTGRES_URL, DATABASE_URL, or POSTGRES_URL');
    }

    pool = createPool({ connectionString });
    sql = pool.sql;
  }
  return sql;
}

export function getDB() {
  return initPool();
}

/**
 * Direct export for convenience (lazily initialized)
 */
export const db = new Proxy({}, {
  get(target, prop) {
    return initPool()[prop];
  }
});
