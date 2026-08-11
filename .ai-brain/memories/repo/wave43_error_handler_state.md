# Wave 43 — Express Error Handler

**Date:** 2026-08-05
**Branch (submodule):** `integration/all-epics` @ `6d008f0`
**Branch (parent):** `ops/jumanasoft-enterprise-facility-platform-staging-prep` @ `1cb39373`
**Status:** ✅ DEPLOYED + VERIFIED

## What it surfaces

100+ route handlers in server.js catch errors with `res.status(500).json({ error: 'Server error' })` — silencing the actual cause. Plus:
- No Express error middleware → errors via `next(err)` are lost
- JSON parse errors returned HTML error pages instead of JSON
- No baseline for "what's normal"

## Solution

4-arg Express error middleware + classifier + Prometheus exporter:
- Classifies errors: parse (400) / rls (403) / not_found / server (500) / bad_req
- Returns clean JSON `{ error, kind }` instead of HTML
- Increments per-class + per-status counters
- Audits to tenant 0 system trail
- Logs to console (truncated 200 chars)

## Endpoints

| Endpoint | Auth | Notes |
|---|---|---|
| `GET /api/metrics/errors` | public (scrape) | 6 + per-status gauges |
| `GET /api/security/errors` | Admin/IT | JSON, full breakdown |

## Test status

- 37/37 wave43 tests pass on local + prod
- Cumulative waves 31-43: **273/273 PASS**

## Production verification

- 50 malformed JSON POSTs → 14 caught (across 3+ PM2 workers)
- Response shape: `{"error":"Expected property name or '}' in JSON at position 1","kind":"parse"}`

## Lessons learned

1. **Express route order matters for catch-all** — `app.get('*')` matches first if registered first,
   even if a more specific route is registered later. Specific routes MUST come before the catch-all.
2. **error middleware MUST be last** — registered after all routes so it sees all errors. Express
   uses registration order, not specificity.
3. **HTML default error pages** are bad for API clients — Express 4's `body-parser` errors return HTML
   unless you register a JSON error handler. The 4-arg middleware fixes this.
4. **Per-worker counter isolation** is normal for in-process metrics. To aggregate across workers,
   use Prometheus + multi-target scraping.

## Follow-ups (deferred)

- Async error auto-wrap (convert all handlers to async (req, res, next) => {...})
- Sentry-style trace IDs
- Per-route error thresholds / alerting
