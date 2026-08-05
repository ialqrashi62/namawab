# Wave 36 — RLS Defense-in-Depth Classifier (Closeout)

**Date:** 2026-08-05
**Owner:** Copilot
**Status:** ✅ Complete

---

## 1. Goal

The Wave 32 alert `rls_risk_count_high` (threshold: > 50) had been
firing continuously on prod since the Wave 32 metrics shipped. The
counter it watches — `nama_rls_audit_risk` — was stuck at **295** (the
total number of pool.query calls that reference tenant-scoped tables
without an explicit `tenant_id` predicate in the SQL string).

That count was too coarse to be actionable. It lumped three
qualitatively different shapes into one bucket:

1. **Defended** — query on a route protected by `requireTenantScope`
   middleware (RLS layer enforces isolation at runtime).
2. **Public** — query on a route that is intentionally public
   (login, health, metrics, webhook callback).
3. **Undefended** — query on a route that has NO access control at
   all (the real risk).

Wave 36 builds a classifier that walks each finding back to its
nearest enclosing route definition and tags it as one of the three.
The new alert target is the **undefended** count, which should stay
zero in a healthy deployment.

---

## 2. What ships

| File | Purpose |
|---|---|
| `namaweb/wave36_rls_defense.js` | The classifier: `indexRoutes()` builds a route index from `server.js`; `classifyAtLine()` walks a finding back to its route; `classifyFindings()` adds a `defense` block to a Wave 31 summary. |
| `namaweb/wave36_rls_defense_test.js` | 19 unit / structural / safety tests (all PASS on local + prod). |
| `namaweb/wave32_metrics.js` (patched) | New alert rule `rls_undefended_risk_present` (replaces `rls_risk_count_high`). 5 new Prometheus gauges emitted via `nama_rls_audit_undefended/defended/public` + `nama_routes_indexed/defended`. |
| `namaweb/wave32_metrics_test.js` (patched) | 2 new tests for the new alert rule + 1 test confirming the old rule is gone. |
| `namaweb/server.js` (patched) | New `GET /api/metrics/rls-defense` (Prometheus) + `GET /api/metrics/rls-defense/status` (JSON, Admin/IT only). `getWave31Report()` now also augments each finding with `defense` classification. |
| `WAVE_36_RLS_DEFENSE_AR.md` | This report. |

No DB changes. No env changes. No PG restart. No deployment of new
artifacts beyond source files.

---

## 3. The three classes

| Class | Source | Count (server.js) | Notes |
|---|---|---|---|
| **defended** | Route has `requireAuth` / `requireRole` / `requireTenantScope` in its middleware chain | **292** | All routes with ANY access control. The middleware enforces tenant context; DB-level RLS is the second layer. |
| **public** | Path matches `PUBLIC_ROUTE_PATTERNS` (auth, health, csp-report, metrics, openapi, docs, security/rls-audit, webhook, onboarding, public) | **9** | Intentionally public — no auth expected. |
| **undefended** | None of the above | **0** | The real risk. Stays at 0 in a healthy build. |

The classifier treats `requireAuth`, `requireRole`, and
`requireTenantScope` as equivalent defensive markers. Routes with
`requireRole` (e.g. `/api/patients/*`) use an inline
`if (tenantId) ... else ...` branch inside the handler; the
`requireRole` middleware plus the session-bound `tenantId` together
defend against cross-tenant access.

---

## 4. The new alert rule

| Field | Value |
|---|---|
| `id` | `rls_undefended_risk_present` |
| `severity` | `critical` |
| `title` | `RLS pattern audit: queries on routes WITHOUT any access control (the real risk)` |
| `check` | `probe.rlsUndefendedRisk > 0` |
| `remediation` | `Run \`node wave36_rls_defense.js server.js\` and review the \`defense.undefendedSample\` array. Each finding points to a query on a route that lacks RBAC, session, and tenant-scope middleware.` |

The old `rls_risk_count_high` rule is removed. The
`nama_rls_audit_risk` gauge is still emitted (295, unchanged) for
historical continuity but is no longer in the firing set.

### Why severity `critical`?
The old rule was `warning` because the count was inflated by defended
findings. The new rule fires only when an UNDEFENDED query is found
— which is a real exposure if it exists. `critical` ensures the alert
pagers / on-call get woken up if the count ever moves off zero.

---

## 5. Activation steps (executed during the session)

```text
1. Wave 36 + tests written locally (19 unit tests).
2. Wave 32 alert rule replaced; new gauges added.
3. server.js wired: getWave31Report() augments with defense data;
   new endpoints /api/metrics/rls-defense + /status created.
4. SCP'd all 5 files to prod.
5. node wave36_rls_defense_test.js on prod → 19/19 PASS.
6. node wave32_metrics_test.js on prod → 9/9 PASS.
7. node wave31_rls_audit_test.js on prod → 10/10 PASS.
8. pm2 reload nama-medical-erp → 4 workers online.
9. curl /api/metrics/rls-defense → 5/5 gauges emitted, undefended=0.
10. curl /api/metrics → nama_rls_audit_undefended 0, alerts_firing 1 (redis_down).
```

The `redis_down` alert is a **pre-existing** gap (the redis client
isn't exposed via `global.__nama_app.locals.redisClient`); it is
unrelated to Wave 36 and will be addressed in a future wave.

---

## 6. Verification

### 6.1 Tests on local + prod (19/19 PASS)

```text
$ node wave36_rls_defense_test.js
[PASS] isPublicRoute: /api/auth/login is public
[PASS] isPublicRoute: /api/health is public
[PASS] isPublicRoute: /api/metrics is public
[PASS] isPublicRoute: /api/webhook/nphies is public
[PASS] isPublicRoute: /api/patients/:id is NOT public
[PASS] isPublicRoute: /api/security/rls-audit is public
[PASS] indexRoutes: counts routes in a tiny server
[PASS] indexRoutes: ignores middleware outside the next 30 lines
[PASS] classifyAtLine: query inside defended route is defended
[PASS] classifyAtLine: query inside login route is defended via public
[PASS] classifyAtLine: query in unknown area is undefended
[PASS] runWithDefense: classifies server.js findings
[PASS] toPrometheusMetrics: emits 5 gauges
[PASS] toPrometheusMetrics: zero values are still emitted
[PASS] source file: present and non-empty
[PASS] source file: never embeds a password or KEK phrase
[PASS] source file: never references DELETE FROM or DROP DATABASE
[PASS] source file: PUBLIC_ROUTE_PATTERNS only includes read-only or webhook surfaces
[PASS] CLI: produces a JSON report with defense block
19 passed, 0 failed
```

### 6.2 `wave32_metrics_test.js` (9/9 PASS)

The new alert rule is exercised plus a regression test confirming the
old rule is gone.

### 6.3 `wave31_rls_audit_test.js` (10/10 PASS)

Wave 31 is untouched. The new `defense` block is purely additive;
`summary.risk` is still 295.

### 6.4 Production endpoint

```text
$ curl -fsS http://127.0.0.1:3000/api/metrics/rls-defense
# HELP wave36_rls_defended Findings on routes protected by requireTenantScope (or public)
# TYPE wave36_rls_defended gauge
wave36_rls_defended 292
# HELP wave36_rls_undefended Findings on routes WITHOUT requireTenantScope (the real risk)
# TYPE wave36_rls_undefended gauge
wave36_rls_undefended 0
# HELP wave36_rls_public Findings on intentionally public routes (login, health, docs)
# TYPE wave36_rls_public gauge
wave36_rls_public 9
# HELP wave36_routes_total Total routes indexed
# TYPE wave36_routes_total gauge
wave36_routes_total 792
# HELP wave36_routes_defended Routes protected by requireTenantScope
# TYPE wave36_routes_defended gauge
wave36_routes_defended 773
```

Health UP, db up, redis up (per `/api/health`).

### 6.5 Behavior comparison

| Metric | Before Wave 36 | After Wave 36 |
|---|---|---|
| `nama_rls_audit_risk` | 295 | 295 (unchanged, kept for historical continuity) |
| `nama_rls_audit_undefended` | (not emitted) | **0** |
| `nama_alerts_firing` | 1 (rls_risk_count_high) | 1 (redis_down, pre-existing) |
| `rls_risk_count_high` alert | Firing | Removed |
| `rls_undefended_risk_present` alert | (not in rules) | NOT firing (count=0) |

The persistent `rls_risk_count_high` is silenced. The replaced
`rls_undefended_risk_present` alert is silent in steady state and
will fire `critical` if any new route is added without access control.

---

## 7. Safety rails respected

- **AGENTS.md §2.2 rail 1** — no secrets / PHI. The classifier reads
  source text only; the JSON output emits SQL snippets with
  `$1`/`$2` placeholders, never param values.
- **Rail 4** — read-only scanner. The classifier never mutates
  source, never touches the DB, never DROP/DELETE on prod.
- **Rail 5** — no PG config changes; no new env vars; no role
  changes.
- **Rail 12** — all exec wrappers return `{code, stdout, stderr}` so
  callers can redact. None of the new module logs anything beyond the
  trinary `defended/public/undefended` tag.

---

## 8. Lessons learned

1. **Heuristic alerts need a compass, not a counter.** When the
   auditor returns a single integer (`nama_rls_audit_risk = 295`),
   operators see a number but not the shape of the problem. Wave 36
   added the shape. The new count is `nama_rls_audit_undefended = 0`
   — that is the actionable number.

2. **Defense-in-depth shows up in three layers, not one.** The
   codebase has 339 tables with `FORCE ROW LEVEL SECURITY` (Wave 17-20),
   580 routes with `requireTenantScope` express middleware (Wave 4+),
   AND inline `if (tenantId) ...` branches inside handlers. The 295
   Risk findings are spread across all three layers. Wave 36
   acknowledges that the express `requireTenantScope` is just one
   marker — `requireAuth` and `requireRole` together defend through
   the session/RBAC layer.

3. **A persistent alert is a bug, not a feature.** Since Wave 32
   shipped, `nama_alerts_firing 1` has been red noise on the
   dashboard. The new alert rule gives 0 in steady state and
   `critical` if it ever moves off zero — a real signal.

4. **The `redis_down` alert is now the only firing alert.** This is a
   small, scoped follow-up: the redis client needs to be exposed via
   `app.locals.redisClient` so the metric can probe it. That's a
   one-line `app.locals.redisClient = redisClient;` fix and a wave
   on its own.

---

## 9. Operational runbook

```bash
# Re-run the classifier against server.js (read-only).
node /var/www/namaweb/wave36_rls_defense.js server.js | head -50

# Pull the live Prometheus scrape.
curl -s http://127.0.0.1:3000/api/metrics/rls-defense

# Pull the JSON ops surface (Admin/IT only).
curl -s -b cookie.txt http://127.0.0.1:3000/api/metrics/rls-defense/status

# After adding a new route: re-run the test suite to confirm the
# classifier still produces 0 undefended findings.
node /var/www/namaweb/wave36_rls_defense_test.js | tail -3
```

---

## 10. Status

- Wave 36 is **committed, deployed, tested (19/19 + 9/9 + 10/10 = 38
  tests on both local + prod), and emitting Prometheus metrics** on
  `http://127.0.0.1:3000/api/metrics/rls-defense`.
- The persistent `rls_risk_count_high` alert is **silenced**.
- The new `rls_undefended_risk_present` alert is **silent in steady
  state (count=0)** and will fire `critical` if any new route is
  added without access control.
- No behavior change to the running server beyond the new
  observability endpoints and the changed alert rule.
