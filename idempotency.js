/**
 * idempotency.js — financial idempotency guard (GATE12-H: prevent duplicate money mutations).
 *
 * Problem: money-mutating POSTs (create invoice, pay, refund, post journal) had NO replay protection,
 * so a double-click, a client retry, or a network race could create DUPLICATE invoices/payments. This
 * module adds opt-in, per-tenant idempotency keyed by a client-supplied `Idempotency-Key` header.
 *
 * Design (mirrors ./billing_integrity & ./validation — additive, fail-safe):
 *   - PURE core (deriveKey, decideAction) is unit-tested with no DB.
 *   - makeIdempotencyGuard(pool, ...) returns Express middleware. It is OPT-IN: a request with no
 *     Idempotency-Key passes straight through (zero behavior change for existing clients).
 *   - First request with a key: claims the key (in_progress) via a UNIQUE (tenant_id, key, route)
 *     constraint, runs the handler, then stores the final {status, body}.
 *   - Replay (same key, completed): returns the STORED response (status + body), header
 *     `Idempotent-Replay: true` — the handler never runs again, so no duplicate row is created.
 *   - Concurrent duplicate (key still in_progress, or lost the INSERT race): 409 IDEMPOTENCY_CONFLICT.
 *   - FAIL-OPEN on store errors: if the idempotency table is unreachable we LOG and proceed, because
 *     blocking legitimate billing on an infra hiccup is worse than losing replay protection briefly.
 *   - Only 2xx/4xx responses are stored (5xx is deleted so the client may safely retry).
 *
 * Storage: table `idempotency_keys` (see migrations/e23_01_idempotency_keys_up.sql), RLS tenant-scoped.
 */
'use strict';

// Accept a client idempotency key from the standard header (or the x- variant). Bounded to avoid abuse.
function deriveKey(req) {
    const h = (req && req.headers) || {};
    const raw = h['idempotency-key'] || h['x-idempotency-key'];
    if (typeof raw !== 'string') return null;
    const k = raw.trim();
    if (k.length < 8 || k.length > 200) return null;        // too short to be unique / too long to store
    if (!/^[A-Za-z0-9._:-]+$/.test(k)) return null;          // conservative charset
    return k;
}

// Pure decision from the existing DB row (or null). Keeps the middleware logic testable.
function decideAction(existing) {
    if (!existing) return { action: 'proceed' };
    if (existing.status === 'completed') {
        return { action: 'replay', statusCode: existing.response_status || 200, body: existing.response_body };
    }
    return { action: 'conflict' };  // in_progress => a duplicate is mid-flight
}

function routeKey(req) {
    // stable per-endpoint scope so the same key on a different route doesn't collide
    return (req.baseUrl || '') + ((req.route && req.route.path) || req.path || '');
}

/**
 * makeIdempotencyGuard({ pool, getTenantId, enabled, logger })
 *   pool        : a pg pool/Pool-like with .query (the app's tenant-bound pool)
 *   getTenantId : (req) => number|null   (defaults to null => relies on RLS/global)
 *   enabled     : default true
 */
function makeIdempotencyGuard({ pool, getTenantId = () => null, enabled = true, logger = console } = {}) {
    if (!pool || typeof pool.query !== 'function') throw new Error('idempotency: a pool with .query is required');

    return async function idempotencyGuard(req, res, next) {
        if (!enabled) return next();
        const key = deriveKey(req);
        if (!key) return next();                       // opt-in: no key => no guard

        const tenantId = (() => { try { return getTenantId(req); } catch { return null; } })();
        const route = routeKey(req);

        try {
            const existing = (await pool.query(
                `SELECT status, response_status, response_body
                   FROM idempotency_keys
                  WHERE tenant_id IS NOT DISTINCT FROM $1 AND idem_key = $2 AND route = $3`,
                [tenantId, key, route])).rows[0];

            const decision = decideAction(existing);
            if (decision.action === 'replay') {
                res.set('Idempotent-Replay', 'true');
                return res.status(decision.statusCode).json(decision.body);
            }
            if (decision.action === 'conflict') {
                return res.status(409).json({ error: 'Duplicate request in progress', code: 'IDEMPOTENCY_CONFLICT' });
            }

            // Claim the key. The UNIQUE(tenant_id, idem_key, route) index makes this the race arbiter.
            try {
                await pool.query(
                    `INSERT INTO idempotency_keys (tenant_id, idem_key, route, status) VALUES ($1,$2,$3,'in_progress')`,
                    [tenantId, key, route]);
            } catch (raceErr) {
                // someone else claimed it between our SELECT and INSERT => treat as a duplicate
                return res.status(409).json({ error: 'Duplicate request', code: 'IDEMPOTENCY_CONFLICT' });
            }
        } catch (storeErr) {
            if (logger && logger.warn) logger.warn('[idempotency] store unavailable, proceeding fail-open:', storeErr.message);
            return next();   // never block billing on an infra error
        }

        // Wrap res.json to persist the final response once the handler answers.
        const originalJson = res.json.bind(res);
        let persisted = false;
        res.json = (body) => {
            if (!persisted) {
                persisted = true;
                const status = res.statusCode || 200;
                const keepable = status >= 200 && status < 500;   // store success + client errors; 5xx => retryable
                const sql = keepable
                    ? `UPDATE idempotency_keys SET status='completed', response_status=$1, response_body=$2::jsonb, completed_at=now()
                         WHERE tenant_id IS NOT DISTINCT FROM $3 AND idem_key=$4 AND route=$5`
                    : `DELETE FROM idempotency_keys WHERE tenant_id IS NOT DISTINCT FROM $1 AND idem_key=$2 AND route=$3`;
                const params = keepable
                    ? [status, JSON.stringify(body == null ? null : body), tenantId, key, route]
                    : [tenantId, key, route];
                Promise.resolve(pool.query(sql, params)).catch(e => {
                    if (logger && logger.warn) logger.warn('[idempotency] persist failed:', e.message);
                });
            }
            return originalJson(body);
        };

        return next();
    };
}

module.exports = { deriveKey, decideAction, routeKey, makeIdempotencyGuard };
