/**
 * pcc/audit_store.js — PCC audit log persistence (PostgreSQL)
 *
 * Phase: PCC Sandbox v3.316.21
 *
 * Adds an optional, env-gated persistence layer for the in-memory
 * audit ring buffer. When PCC_AUDIT_PERSIST !== 'true', this module
 * is fully inert (no DB connection, no timers, no logging).
 *
 * When enabled, every call to recordAuditEntry() pushes into a
 * bounded in-memory buffer (max 500). A 2-second setInterval drains
 * the buffer in batches of up to 100 rows via a single parameterized
 * INSERT into pcc_call_log. All errors are caught and swallowed —
 * audit persistence must never crash the request path.
 *
 * Field mapping (in-memory entry -> pcc_call_log row):
 *   module      <- entry.path (e.g. /api/v1/pcc-cardio-ext102/call/foo
 *                  -> 'pcc-cardio-ext102')
 *   function    <- entry.path (last segment after /call/ or /record)
 *   tenant_id   <- entry.tenant_id
 *   decision_id <- entry.decisionId
 *   created_by  <- entry.ip
 *   input       <- JSONB { path, method, status, user_agent, query }
 *   output      <- JSONB {} (PHI-safe: never capture response bodies)
 *   called_at   <- entry.ts (already ISO)
 *   duration_ms <- entry.duration_ms || 0
 */
'use strict';

const FLUSH_INTERVAL_MS = 2000;
const BUFFER_MAX = 500;
const BATCH_MAX = 100;

// --- Internal state -----------------------------------------------------------
let _pool = null;
let _buffer = [];           // Array of normalized rows ready for INSERT
let _interval = null;
let _closing = false;

// --- Helpers ------------------------------------------------------------------

/**
 * Extract module slug from a path like
 *   /api/v1/pcc-cardio-ext102/call/foo  -> 'pcc-cardio-ext102'
 *   /api/v1/pcc-cardio-ext102/record    -> 'pcc-cardio-ext102'
 * Falls back to the bare path if no /api/v1/ prefix is present.
 */
function extractModule(path) {
  if (typeof path !== 'string') return null;
  const m = path.match(/^\/api\/v1\/([^/]+)/);
  return m ? m[1] : path;
}

/**
 * Extract function segment from a path like
 *   /api/v1/pcc-cardio-ext102/call/foo  -> 'foo'
 *   /api/v1/pcc-cardio-ext102/record    -> 'record'
 *   /api/v1/pcc-cardio-ext102/call/a/b  -> 'a/b'   (preserve sub-paths for /call/*)
 */
function extractFunction(path) {
  if (typeof path !== 'string') return null;
  const callMatch = path.match(/\/call\/(.+)$/);
  if (callMatch) return callMatch[1];
  const recordMatch = path.match(/\/record(?:\/|$)/);
  if (recordMatch) return 'record';
  return null;
}

/**
 * Normalize an audit entry into the shape expected by pcc_call_log.
 * Returns null if the entry is missing required fields (dropped silently).
 */
function normalizeEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const path = entry.path;
  if (!path) return null;

  const module = extractModule(path);
  const fn = extractFunction(path);
  if (!module || !fn) return null;

  const input = {
    path: path,
    method: entry.method || null,
    status: entry.status || null,
    user_agent: entry.user_agent || null,
    query: entry.query || null,
  };

  return {
    module: module,
    function: fn,
    tenant_id: entry.tenant_id || null,
    decision_id: entry.decision_id || entry.decisionId || null,
    created_by: entry.ip || null,
    input: JSON.stringify(input),
    output: '{}',
    called_at: entry.ts || new Date().toISOString(),
    duration_ms: Number.isFinite(entry.duration_ms) ? entry.duration_ms : 0,
  };
}

/**
 * Drain up to BATCH_MAX rows from the buffer with a single INSERT.
 * Uses parameterized placeholders so no user-supplied string can
 * reach the SQL grammar. Errors are logged and swallowed.
 */
async function flushOnce() {
  if (!_pool || _buffer.length === 0) return;
  const batch = _buffer.splice(0, BATCH_MAX);

  const cols = ['module', 'function', 'tenant_id', 'decision_id', 'created_by',
                'input', 'output', 'called_at', 'duration_ms'];
  const placeholders = [];
  const values = [];
  for (let i = 0; i < batch.length; i++) {
    const row = batch[i];
    const base = i * cols.length;
    placeholders.push(
      `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, ` +
      `$${base + 6}::jsonb, $${base + 7}::jsonb, $${base + 8}::timestamptz, $${base + 9})`
    );
    values.push(row.module, row.function, row.tenant_id, row.decision_id,
                row.created_by, row.input, row.output, row.called_at, row.duration_ms);
  }

  const sql = `INSERT INTO pcc_call_log (${cols.join(', ')}) VALUES ${placeholders.join(', ')}`;
  try {
    await _pool.query(sql, values);
  } catch (e) {
    try { console.error('[audit_store] flush failed:', e.message); } catch (_) { /* ignore */ }
    // Drop the batch — audit persistence is best-effort, never block the request path.
  }
}

// --- Public API ---------------------------------------------------------------

/**
 * Initialize the audit store. No-op when PCC_AUDIT_PERSIST !== 'true'.
 * @param {object} pool - pg.Pool instance from db.js
 */
function initAuditStore(pool) {
  if (process.env.PCC_AUDIT_PERSIST !== 'true') return;
  if (_pool) return; // idempotent
  if (!pool) {
    try { console.error('[audit_store] initAuditStore: pool is null; skipping'); } catch (_) { /* ignore */ }
    return;
  }
  _pool = pool;
  _buffer = [];
  _interval = setInterval(() => {
    if (_closing) return;
    flushOnce().catch(() => { /* already logged in flushOnce */ });
  }, FLUSH_INTERVAL_MS);
  // Don't keep the event loop alive on shutdown.
  if (_interval && typeof _interval.unref === 'function') _interval.unref();
}

/**
 * Push an audit entry onto the buffer. Synchronous, never throws.
 * @param {object} pool - pg.Pool instance (kept for API symmetry; unused)
 * @param {object} entry - audit entry from pccAuditEntry
 */
function recordAuditEntry(pool, entry) {
  if (!_pool) return; // disabled
  if (_buffer.length >= BUFFER_MAX) {
    // Buffer full — drop the oldest entry to bound memory.
    _buffer.shift();
  }
  const row = normalizeEntry(entry);
  if (row) _buffer.push(row);
}

/**
 * Record a 429 event to pcc_rate_limit_log. Env-gated (no-op unless
 * PCC_AUDIT_PERSIST=true). Never throws.
 */
function recordRateLimitEvent(pool, event) {
  if (process.env.PCC_AUDIT_PERSIST !== 'true') return;
  if (!pool || !event || !event.ip) return;
  // bucket_start is the start of the current minute (truncate seconds)
  const now = new Date();
  const bucketStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                                now.getHours(), now.getMinutes(), 0, 0);
  const sql = `
    INSERT INTO pcc_rate_limit_log (ip, endpoint, bucket_start, count, blocked)
    VALUES ($1, $2, $3, $4, TRUE)
  `;
  pool.query(sql, [
    String(event.ip).slice(0, 64),
    String(event.endpoint || '').slice(0, 256),
    bucketStart.toISOString(),
    parseInt(event.count, 10) || 0,
  ]).catch(e => {
    console.error('[audit_store] rate-limit insert failed:', e.message);
  });
}

/**
 * Best-effort drain on shutdown. Not awaited — caller controls timing.
 */
function closeAuditStore() {
  _closing = true;
  if (_interval) {
    clearInterval(_interval);
    _interval = null;
  }
  // Best-effort: launch one final flush. Errors are swallowed.
  if (_pool && _buffer.length > 0) {
    flushOnce().catch(() => { /* ignore */ });
  }
  _pool = null;
  _buffer = [];
  _closing = false;
}

module.exports = {
  initAuditStore,
  recordAuditEntry,
  recordRateLimitEvent,
  closeAuditStore,
  // exported for tests
  _normalizeEntry: normalizeEntry,
  _extractModule: extractModule,
  _extractFunction: extractFunction,
};
