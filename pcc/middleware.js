/**
 * pcc/middleware.js — middleware stubs for the PCC sandbox
 *
 * These are PCC-sandbox implementations. In production they would
 * delegate to the canonical `namaweb/middleware/` modules.
 */
'use strict';

const crypto = require('crypto');

/* ============================================================
 * authenticate
 * ============================================================ */
function authenticate(req, res, next) {
  // PCC sandbox: trust a header for the userId/tenantId
  const userId = req.header('x-pcc-user-id');
  const tenantId = req.header('x-pcc-tenant-id');
  const role = req.header('x-pcc-role') || 'CARD';
  if (!userId || !tenantId) {
    return res.status(401).json({ error: 'missing auth headers' });
  }
  req.session = { userId: parseInt(userId, 10), tenantId, role };
  next();
}

/* ============================================================
 * requireTenantScope
 * ============================================================ */
function requireTenantScope(req, res, next) {
  if (!req.session || !req.session.tenantId) {
    return res.status(403).json({ error: 'no tenant in session' });
  }
  next();
}

/* ============================================================
 * requireRole
 * ============================================================ */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.session || req.session.role !== role) {
      return res.status(403).json({ error: `role ${role} required` });
    }
    next();
  };
}

/* ============================================================
 * validateBody
 * ============================================================ */
function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
  };
}

/* ============================================================
 * idempotencyGuard (in-memory for PCC)
 * ============================================================ */
const IDEMPOTENCY_CACHE = new Map();
function idempotencyGuard(req, res, next) {
  const key = req.header('idempotency-key');
  if (!key) {
    return res.status(400).json({ error: 'idempotency-key header required' });
  }
  if (IDEMPOTENCY_CACHE.has(key)) {
    const cached = IDEMPOTENCY_CACHE.get(key);
    return res.status(200).json(cached);
  }
  const orig = res.json.bind(res);
  res.json = (body) => {
    IDEMPOTENCY_CACHE.set(key, body);
    return orig(body);
  };
  next();
}

/* ============================================================
 * writeAuditLog — hash-chained audit
 * ============================================================ */
async function writeAuditLog(client, { tenantId, procedureId, actorId, action, entityType, entityId, payload }) {
  const prev = await client.query(
    `SELECT entry_hash FROM cath_lab_audit_log
     WHERE tenant_id = $1 AND procedure_id IS NOT DISTINCT FROM $2
     ORDER BY id DESC LIMIT 1`,
    [tenantId, procedureId || null]
  );
  const prevHash = prev.rows[0]?.entry_hash || null;
  const payloadStr = JSON.stringify({ tenantId, procedureId, actorId, action, entityType, entityId, payload, prevHash });
  const entryHash = crypto.createHash('sha256').update(payloadStr).digest('hex');
  await client.query(
    `INSERT INTO cath_lab_audit_log
       (tenant_id, procedure_id, actor_id, action, entity_type,
        entity_id, payload, prev_hash, entry_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [tenantId, procedureId || null, actorId, action, entityType,
     entityId, JSON.stringify(payload), prevHash, entryHash]
  );
}

module.exports = {
  authenticate,
  requireTenantScope,
  requireRole,
  validateBody,
  idempotencyGuard,
  writeAuditLog,
};
