'use strict';

// v3.316.25: PG-backed bearer token storage. Replaces the v3.316.24 in-memory
// Map with durable PostgreSQL rows. Always-on (no env gate) — tokens are cheap
// to store and the table is small.
const TABLE = 'pcc_api_tokens';

let POOL = null;

function initTokenStore(pool) {
  POOL = pool;
}

async function issueToken({ label = 'default', ttlMs = 30 * 24 * 60 * 60 * 1000 } = {}) {
  if (!POOL) throw new Error('token_store not initialized');
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const expires = now + ttlMs;
  try {
    await POOL.query(
      `INSERT INTO ${TABLE} (token, label, expires_at) VALUES ($1, $2, to_timestamp($3))`,
      [token, String(label).slice(0, 64), expires / 1000]
    );
  } catch (e) {
    console.error('[token_store] insert failed:', e.message);
    throw e;
  }
  return {
    token,
    label,
    issued_at: new Date(now).toISOString(),
    expires_at: new Date(expires).toISOString(),
  };
}

async function validateToken(token) {
  if (!POOL || !token) return null;
  try {
    const r = await POOL.query(
      `SELECT label, expires_at, revoked_at FROM ${TABLE}
       WHERE token = $1 LIMIT 1`,
      [token]
    );
    if (!r.rows.length) return null;
    const row = r.rows[0];
    if (row.revoked_at) return null;  // explicitly revoked
    if (new Date(row.expires_at).getTime() < Date.now()) return null;  // expired
    return { label: row.label, expires_at: row.expires_at };
  } catch (e) {
    console.error('[token_store] validate failed:', e.message);
    return null;
  }
}

async function revokeToken(token) {
  if (!POOL || !token) return false;
  try {
    const r = await POOL.query(
      `UPDATE ${TABLE} SET revoked_at = NOW() WHERE token = $1 AND revoked_at IS NULL`,
      [token]
    );
    return r.rowCount > 0;
  } catch (e) {
    console.error('[token_store] revoke failed:', e.message);
    return false;
  }
}

async function listTokens() {
  if (!POOL) return [];
  try {
    const r = await POOL.query(
      `SELECT token, label, issued_at, expires_at, revoked_at
       FROM ${TABLE} ORDER BY issued_at DESC LIMIT 200`
    );
    return r.rows.map(row => ({
      token_prefix: String(row.token).slice(0, 8) + '...',
      label: row.label,
      issued_at: row.issued_at,
      expires_at: row.expires_at,
      revoked: !!row.revoked_at,
      expired: new Date(row.expires_at).getTime() < Date.now(),
    }));
  } catch (e) {
    console.error('[token_store] list failed:', e.message);
    return [];
  }
}

function closeTokenStore() {
  POOL = null;
}

module.exports = { initTokenStore, issueToken, validateToken, revokeToken, listTokens, closeTokenStore };