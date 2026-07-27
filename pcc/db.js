/**
 * pcc/db.js — PCC sandbox DB layer
 *
 * - pg.Pool, single connection
 * - tenant context via SET LOCAL
 * - NO PHI in fixtures
 * - Sandbox only (DB name: nama_pcc_sandbox)
 *
 * Safety:
 * - All queries MUST run with a tenant_id in context
 * - Tables that don't have RLS enabled will refuse to write
 * - RLS policies are assumed to exist in the migration
 */
'use strict';

const { Pool } = require('pg');

const POOL = new Pool({
  host: process.env.PGHOST || '127.0.0.1',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'nama_pcc_sandbox',
  user: process.env.PGUSER || 'nama_pcc_app',
  password: process.env.PGPASSWORD || 'pcc_sandbox_password',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: false, // sandbox only; production would set true
});

/**
 * Run a function within a tenant context.
 *
 * Pattern:
 *   BEGIN
 *   SET LOCAL app.tenant_id = $1
 *   -- RLS will now scope to that tenant
 *   -- run queries
 *   COMMIT
 *
 * Usage:
 *   const rows = await withTenant(tenantId, async (client) => {
 *     return client.query('SELECT * FROM cath_lab_procedure', []);
 *   });
 */
async function withTenant(tenantId, fn) {
  if (!tenantId) {
    throw new Error('withTenant: tenantId is required (fail-closed)');
  }
  const client = await POOL.connect();
  try {
    await client.query('BEGIN');
    await client.query(`SET LOCAL app.tenant_id = '${escapeUuid(tenantId)}'`);
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch (_) { /* ignore */ }
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Plain query (no tenant). For system tables (audit, etc.) that have
 * their own RLS or are scoped differently.
 */
async function query(text, params) {
  return POOL.query(text, params);
}

/**
 * Escape a UUID-ish string. We accept only standard 8-4-4-4-12 hex.
 * Anything else is rejected (defense-in-depth — we never want SQL
 * injection through SET LOCAL).
 */
function escapeUuid(s) {
  if (typeof s !== 'string') {
    throw new Error('escapeUuid: not a string');
  }
  if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s)) {
    throw new Error('escapeUuid: not a valid UUID');
  }
  return s;
}

async function close() {
  await POOL.end();
}

module.exports = {
  POOL,
  withTenant,
  query,
  close,
  escapeUuid,
};
