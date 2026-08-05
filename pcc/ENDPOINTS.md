# PCC Sandbox Endpoints Catalog · v3.316.27

> Auto-generated endpoint reference. **Total: ~4045 endpoints** across 8 categories.
> **Base URL (local):** `http://localhost:3100` · **Base URL (live):** `https://jumanasoft.com`
>
> **1322 modules × 3 module routes + ~71 system routes = ~4037 endpoints.**
> Every module folder under `pcc/{slug}/` exposes a uniform 3-route surface;
> this catalog enumerates the system routes explicitly and describes the module
> pattern once.

---

## Health & Probes (5)

K8s-friendly probes. All return `text/plain` and are exempt from auth + rate limit.

| Method | Path | Purpose | Auth | Response |
|---|---|---|---|---|
| GET | `/health` | Service info + module list + audit log size | None | `application/json` |
| GET | `/healthz` | K8s liveness probe | None | `text/plain` `ok` |
| GET | `/livez` | K8s process liveness | None | `text/plain` `alive` |
| GET | `/readyz` | K8s readiness with checks (DB, audit store, token store) | None | `text/plain` `ready` / `not ready` |
| GET | `/_metrics` | Prometheus text format (counters, gauges, histogram) | None | `text/plain; version=0.0.4` |

---

## Catalog (15)

Mounted at `/api/v1/pcc-catalog`. The catalog is the single source of truth for
module metadata; everything else (GraphQL, SDKs, the static UI) reads from it.

| Method | Path | Purpose | Auth | Response |
|---|---|---|---|---|
| GET | `/api/v1/pcc-catalog/modules?limit=N&offset=0` | Paginated module list | Optional | `{count, modules[]}` |
| GET | `/api/v1/pcc-catalog/categories` | 255 category list with counts | Optional | `{categories[]}` |
| GET | `/api/v1/pcc-catalog/module/:slug` | Single module metadata | Optional | `{module, version, functions[], endpoints{...}}` |
| GET | `/api/v1/pcc-catalog/search?q=…&limit=50` | Tokenized module search | Optional | `{query, tokens, count, results[]}` |
| GET | `/api/v1/pcc-catalog/lookup/:fn` | Reverse: function name → modules | Optional | `{fn, count, modules[]}` |
| GET | `/api/v1/pcc-catalog/function/:name` | Function metadata (alias of `/lookup/:fn`) | Optional | `{fn, count, modules[]}` |
| GET | `/api/v1/pcc-catalog/stats` | Module/function counts + top categories | Optional | `{totalModules, totalFunctions, topCategories[]}` |
| GET | `/api/v1/pcc-catalog/coverage` | Per-category module coverage breakdown | Optional | `{total, perCategory[]}` |
| GET | `/api/v1/pcc-catalog/duplicates` | Cross-module function duplicates | Optional | `{function, modules[]}[]` |
| GET | `/api/v1/pcc-catalog/orphans` | Modules with declared/actual function mismatches | Optional | `{orphans_count, orphans[]}` |
| GET | `/api/v1/pcc-catalog/random` | Random module picker (for explore/demo) | Optional | `{module, endpoints{...}}` |
| GET | `/api/v1/pcc-catalog/health` | Catalog-specific health (version, count, drift) | Optional | `{version, count, healthy}` |
| GET | `/api/v1/pcc-catalog/ping` | Liveness for the catalog router | Optional | `{pong: true}` |
| GET | `/api/v1/pcc-catalog/snapshots` | Daily snapshot index | Optional | `{count, snapshots[]}` |
| GET | `/api/v1/pcc-catalog/migrate-pg` | PG migration status (read-only) | Optional | `{applied[], pending[]}` |
| GET | `/api/v1/pcc-catalog/badge.svg` | shields.io-style dynamic badge | Optional | `image/svg+xml` |
| GET | `/catalog.json` | Full catalog dump (1322 modules) | Optional | `{version, count, modules[]}` |

> `Optional` = exempt from the bearer-token check on `pccBearerAuth` for
> read-only catalog browsing; write endpoints (`/record`, `/api-token`) require
> the bearer token.

---

## Module endpoints (1322 × 3 = 3966)

Every module folder under `pcc/` (e.g. `pcc/pcc_cardiology/`) exposes the same
3-route surface, mounted at `/api/v1/pcc-{url_slug}/`:

| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/api/v1/pcc-{slug}/list` | List the module's 10 deterministic functions | Bearer |
| POST | `/api/v1/pcc-{slug}/call/{fn}` | Invoke a single function (sync) | Bearer + tenant |
| POST | `/api/v1/pcc-{slug}/record` | Persist a function call result to audit log + (optionally) PG | Bearer + tenant + idempotency |

**Example — Cardiology module:**

```bash
# list the 10 cardiology functions
curl -H "Authorization: Bearer $PCC_TOKEN" \
     http://localhost:3100/api/v1/pcc-cardiology/list

# call a function
curl -H "Authorization: Bearer $PCC_TOKEN" \
     -H "Content-Type: application/json" \
     -H "x-pcc-tenant-id: 00000000-0000-0000-0000-000000000001" \
     -d '{"patientId": 1, "rhythm": "afib", "chads2": 3}' \
     http://localhost:3100/api/v1/pcc-cardiology/call/StrokeRisk

# record a function result (idempotent)
curl -X POST -H "Authorization: Bearer $PCC_TOKEN" \
     -H "Content-Type: application/json" \
     -H "x-pcc-tenant-id: 00000000-0000-0000-0000-000000000001" \
     -H "idempotency-key: $(uuidgen)" \
     -d '{"fn":"StrokeRisk","input":{...},"output":{...}}' \
     http://localhost:3100/api/v1/pcc-cardiology/record
```

**Sample slugs** (of 1322): `pcc-cardiology`, `pcc-emergency`, `pcc-pharmacy`,
`pcc-laboratory`, `pcc-radiology`, `pcc-pediatrics`, `pcc-surgery`, `pcc-icu`,
`pcc-obgyn`, `pcc-cardiology-ext102`, `pcc-neuro-ext102`, `pcc-pain-mgmt`, …

The full list is enumerable via `GET /api/v1/pcc-catalog/modules?limit=2000`.

---

## API Tokens (4)

Mounted at `/api/v1/pcc-catalog/`. Token issuance, listing, revocation, and rotation.
Backed by PG (`token_store.js`); issued tokens are 32-byte hex.

| Method | Path | Purpose | Auth |
|---|---|---|---|
| POST | `/api/v1/pcc-catalog/api-token` | Issue new bearer token (label, scopes, ttl) | Optional (bootstrap) |
| GET | `/api/v1/pcc-catalog/api-token` | List issued tokens (metadata only — never the secret) | Bearer |
| POST | `/api/v1/pcc-catalog/api-token/revoke` | Revoke a token (immediate invalidation) | Optional (recovery) |
| POST | `/api/v1/pcc-catalog/api-token/refresh` | Rotate a token (returns new + grace window for old) | Bearer |

> `/api-token` and `/api-token/revoke` are exempt from the bearer check so
> clients can bootstrap and recover. All other write endpoints require a token.

---

## Diagnostics & Benchmarks (4)

Mounted at `/api/v1/pcc-diagnostics/`. Service-level introspection and load.

| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/api/v1/pcc-diagnostics/diagnostics` | Service diagnostics (memory, uptime, request counts) | Bearer |
| GET | `/api/v1/pcc-diagnostics/version` | Catalog version + build stamp | Bearer |
| GET | `/api/v1/pcc-diagnostics/coverage` | Coverage snapshot (delegates to catalog) | Bearer |
| GET | `/api/v1/pcc-diagnostics/bench/run?duration=10&concurrency=4` | In-process load benchmark (p50/p95/p99) | Bearer |

---

## Status & Snapshots (5)

Public status surface — no auth, no rate limit. Useful for UptimeRobot,
Pingdom, and RSS readers.

| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/status/` · `/status` | Human-readable status page (HTML) | None |
| GET | `/status/status.json` | JSON snapshot of current status | None |
| GET | `/status/index.xml` | RSS feed for status changes | None |
| GET | `/status/stream` | Server-Sent Events stream (uptime, p95, error rate) | None |
| GET | `/api/v1/pcc-catalog/snapshots` | Daily snapshot index (JSON, optional auth) | Optional |

Static snapshots are served from `public/snapshots/` and rotated by
`scripts/daily_snapshot.sh`.

---

## GraphQL (3)

Mounted at `/graphql/`. The schema is auto-generated from the catalog
metadata, so a new module appears in the GraphQL surface on next boot.

| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/graphql/` · `/graphql` | Schema landing (HTML) | None |
| GET | `/graphql/schema.graphql` | SDL (raw schema dump) | None |
| GET | `/graphql/playground` | Interactive GraphQL playground (in-browser) | None |
| GET | `/graphql/query?query=…` | Execute a query via GET (simple callers) | Optional |
| POST | `/graphql/query` | Execute a query (JSON body: `{query, variables}`) | Optional |

**Example:**

```bash
curl -X POST -H "Content-Type: application/json" \
     -d '{"query":"{ stats { totalModules totalFunctions } }"}' \
     http://localhost:3100/graphql/query
```

---

## Static UI (3)

Lightweight server-rendered HTML surfaces for human inspection.

| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/` | API root (JSON: `{name, version, modules, endpoints}`) | None |
| GET | `/docs` · `/docs/` | Swagger UI for the OpenAPI spec | None |
| GET | `/admin` · `/admin/` | Admin dashboard (token issuance, snapshots, audit) | None |
| GET | `/openapi-pcc.yaml` | OpenAPI 3.0 spec (YAML) | None |
| GET | `/quickstart.html` | One-page quickstart | None |
| GET | `/index.html` | Static index | None |

The admin dashboard reads from the in-memory audit log; for PG-backed
audit history, set `PCC_AUDIT_PERSIST=true`.

---

## Summary

| Category | Count | Notes |
|---|---|---|
| Health & Probes | 5 | text/plain, K8s-friendly |
| Catalog | 15 (16 with `/catalog.json`) | Single source of truth |
| Module endpoints | 3966 | 1322 × 3 (list / call / record) |
| API Tokens | 4 | issue / list / revoke / refresh |
| Diagnostics & Benchmarks | 4 | service-level introspection |
| Status & Snapshots | 5 | public, unauthenticated |
| GraphQL | 5 | executor + playground + SDL |
| Static UI | 6 | admin, docs, quickstart, root |
| **Total** | **~4045** | Local: 3100 · Live: jumanasoft.com |

---

## Cross-cutting concerns

| Concern | Where |
|---|---|
| Bearer auth | `pccBearerAuth` middleware · exempts `health`, `docs`, `search`, `lookup`, `module/:slug`, `categories`, `modules`, `coverage`, `stats`, `random`, `duplicates`, `orphans`, `ping`, `api-token`, `api-token/revoke` |
| Tenant isolation | `requireTenantScope` on every protected write · `withTenant(tenantId, fn)` helper |
| Rate limit (global) | `pccRateLimit` · `429` with `Retry-After`, `X-RateLimit-*` headers |
| Rate limit (per-tenant) | `pccTenantRateLimit` · `PCC_AUDIT_PERSIST=true` for 429 persistence |
| Idempotency | `idempotencyGuard` on `/record` and other money/claim routes |
| Audit log | in-memory ring buffer (last 1000) + optional PG (`PCC_AUDIT_PERSIST=true`) · hash-chained |
| CORS | `cors()` allowlist via env · permissive for `*` in dev |
| CSP | `helmet` defaults (report-only in production) |

---

## See also

- [README.md](README.md) — top-level project intro
- [CHANGELOG.md](CHANGELOG.md) — version history
- [RUNBOOK.md](RUNBOOK.md) — live runbook
- [`scripts/`](scripts/) — deploy, health, smoke, snapshot scripts
- [`alerts/pcc-alerts.yaml`](alerts/pcc-alerts.yaml) — 9 Prometheus alert rules
- [`dashboards/pcc-overview.json`](dashboards/pcc-overview.json) — Grafana dashboard
- [`postman/PCC-Sandbox.postman_collection.json`](postman/) — Postman collection
- [`sdk/`](sdk/) — first-party SDKs (TS, Python, Go, Ruby, PHP, Rust, Java, Swift, Kotlin)
