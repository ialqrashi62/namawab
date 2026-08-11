---
name: nm-router-middleware
description: Use when wiring any Express router to a department or system module. Loads the canonical middleware chain (requireAuth → requireTenantScope → requireRole → validateBody → idempotencyGuard) so every router follows AGENTS.md §1 safety rails.
---

# Router Middleware Chain — AGENTS.md §1 Compliance

## Mandatory chain (in this order)

```js
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');

router.post('/assessments/foo',
    requireAuth,                                    // session.user required
    requireTenantScope,                             // sets req.tenantId from session or x-tenant-id
    requireRole('doctor','nurse'),                  // RBAC
    validateBody(RS.fooCreate),                     // fail-closed input validation
    idempotencyGuard,                               // POST/PUT/DELETE only
    async (req, res) => {
        try {
            const result = engine.fooScore(req.validated);
            const { rows } = await db.query(...);
            res.status(201).json({ id: rows[0].id, ...result });
        } catch (err) {
            console.error('POST /foo', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);
```

## Per-method rules

| Method | Auth required | Idempotency | Validation |
|---|---|---|---|
| GET | yes | no | optional query schema |
| POST | yes | **yes** | required body schema |
| PUT | yes | **yes** | required body schema |
| DELETE | yes | **yes** | optional body schema |
| Public | no | no | none |

## Mount in server.js (with tenant_bind)

```js
try {
    app.use('/api/foo',
        require('./middleware/tenant_bind'),    // wraps each request in runWithTenant({ tenantId })
        require('./foo_router'));
} catch (e) {
    console.warn('[mount] foo', e.message);
}
```

## File: {dept}_router.js — full template

```js
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./{dept}_engine');

router.get('/{resource}',
    requireAuth,
    requireTenantScope,
    requireRole('doctor','nurse','admin'),
    async (req, res) => {
        try {
            const { rows } = await db.query(
                'SELECT id, payload, result, score, risk, created_at FROM {dept}_{table} WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 50',
                [req.query.patient_id]
            );
            res.json(rows);
        } catch (err) {
            console.error('GET /foo', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

router.post('/{resource}',
    requireAuth,
    requireTenantScope,
    requireRole('doctor'),
    validateBody(RS.{dept}FooCreate),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.fooScore(req.validated);
            const q = `
                INSERT INTO {dept}_{table}
                  (tenant_id, patient_id, assessed_by, payload, score, risk, result)
                VALUES ($1,$2,$3,$4,$5,$6,$7)
                RETURNING id`;
            const { rows } = await db.query(q, [
                req.tenantId, req.validated.patient_id, req.userId,
                req.validated, result.score, result.risk, result
            ]);
            res.status(201).json({ id: rows[0].id, ...result });
        } catch (err) {
            console.error('POST /foo', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
```

## Substitutions

- `{dept}` — short prefix (cardiology, oncology, peds, surgery, etc.)
- `{table}` — short table name (assessments, staging, asa, etc.)
- `{resource}` — URL path segment
- `{dept}FooCreate` — schema name in `route_schemas.js`

## Anti-patterns (rejected by code review)

- ❌ Skipping `requireAuth` — allows unauthenticated writes (RAIL-5)
- ❌ Skipping `requireTenantScope` — exposes cross-tenant data (RAIL-5)
- ❌ Skipping `requireRole` for clinical writes — nurse can order chemo (RAIL-13 Golden Access)
- ❌ Skipping `validateBody` — accepts `req.body` directly (RAIL-1, RAIL-12)
- ❌ Skipping `idempotencyGuard` on POST — duplicate charges/orders (RAIL-6)

## Acceptance gate

Every router MUST have ≥ 1 of each:
- `requireAuth` chain (any route)
- `requireTenantScope` (any route that hits DB)
- `requireRole` (write routes only)
- `validateBody` (write routes only)
- `idempotencyGuard` (POST/PUT/DELETE only)

A router missing any of these is rejected by `nm-deploy-audit`.

## Token saving

Each router = ~80 lines boilerplate per dept. With this template the agent fills
only the route definitions + DB queries, saving ~70% per router × 47 engines = huge.
