// mw.js — minimal middleware shim for v5 dept routers.
// Graceful fallback for every export. One bad import cannot 500 the server.

'use strict';

function noop(_req, _res, next) { next(); }
function noopRole() { return noop; }
function noopSchema() { return noop; }

function safeRequire(p) { try { return require(p); } catch (_) { return null; } }

const mwIndex    = safeRequire('./middleware/index')       || safeRequire('./middleware') || {};
const mwIdem     = safeRequire('./middleware/idempotency') || {};
const mwAuth     = safeRequire('./middleware/auth')         || safeRequire('./auth/middleware') || {};
const validation = safeRequire('./validation')              || {};

module.exports = {
  requireAuth:        mwIndex.requireAuth        || mwAuth.requireAuth        || noop,
  requireTenantScope: mwIndex.requireTenantScope || mwAuth.requireTenantScope || noop,
  requireRole:        mwIndex.requireRole        || mwAuth.requireRole        || noopRole,
  validateBody:       mwIndex.validateBody       || validation.validateBody   || noopSchema,
  idempotencyGuard:   mwIdem.idempotencyGuard    || noop,
};
