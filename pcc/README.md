# PCC Sandbox

**1322 clinical decision modules across 255 categories — 13282 functions**

[![Version](https://img.shields.io/badge/version-3.316.27-blue.svg)](CHANGELOG.md)
[![Modules](https://img.shields.io/badge/modules-1322-10b981.svg)](ENDPOINTS.md)
[![Functions](https://img.shields.io/badge/functions-13282-0ea5e9.svg)](ENDPOINTS.md)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](#license)
[![Live](https://img.shields.io/badge/demo-jumanasoft.com-success.svg)](https://jumanasoft.com)

A self-contained Express + PostgreSQL sandbox that converts the **P3-B L1_DRAFT**
clinical blueprints into runnable code. It sandboxes the live `namaweb/` ERP
without touching it — separate database (`nama_pcc_sandbox`), dummy data, zero PHI,
and loopback-only by default.

> **This is a sandbox.** It does NOT touch the live `namaweb/`,
> `namaweb-ovr-audit-independent/`, `ops/`, or `.env` files.
> See [RUNBOOK.md](RUNBOOK.md) for isolation guarantees.

---

## Quick Start

```bash
git clone https://github.com/jumana/pcc-sandbox.git
cd pcc-sandbox
npm install
node server.js                  # http://localhost:3100
```

```bash
curl http://localhost:3100/health                       # service info
curl http://localhost:3100/api/v1/pcc-catalog/stats     # 1322 modules
curl http://localhost:3100/_metrics                     # Prometheus
```

Optional: bring up PostgreSQL on `127.0.0.1:5432`, create `nama_pcc_sandbox`,
then apply `migrations/cath_lab_up.sql` to unlock the 30 protected engine routes.

---

## What's New in v3.316.27

12 versions · 1322 modules · 13282 functions · ~4045 endpoints

| Feature | Endpoint / Artifact | Notes |
|---|---|---|
| Per-tenant rate limit | middleware (`pccTenantRateLimit`) | Tenant-scoped, header-aware, PG-persisted 429s |
| PostgreSQL audit persistence | `audit_store.js` · `PCC_AUDIT_PERSIST=true` | Hash-chained, 7+ year retention opt-in |
| K8s probes | `/healthz` · `/livez` · `/readyz` | text/plain, ready for `livenessProbe` / `readinessProbe` |
| Prometheus metrics + histogram | `/_metrics` | `pcc_request_duration_seconds` with `le` buckets |
| GraphQL executor + playground | `/graphql/query` · `/graphql/playground` | SDL at `/graphql/schema.graphql` |
| API tokens (issue / revoke / refresh) | `POST /api/v1/pcc-catalog/api-token` | PG-backed (`token_store.js`), 32-byte hex |
| Public status page | `/status/` · `/status/status.json` · `/status/index.xml` | HTML, JSON, RSS |
| Daily snapshots (strict JSON) | `scripts/daily_snapshot.sh` · `/snapshots/` | Rotated, content-type checked |
| Server-Sent Events stream | `/status/stream` | Live uptime, p95, error rate |
| 9 Prometheus alerting rules | `alerts/pcc-alerts.yaml` | High error rate, low module count, token-store lag |

See [CHANGELOG.md](CHANGELOG.md) for the full history.

---

## Endpoints at a Glance

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Service info + module list |
| GET | `/healthz` · `/livez` · `/readyz` | K8s probes (text/plain) |
| GET | `/_metrics` | Prometheus text format |
| GET | `/api/v1/pcc-catalog/stats` | Module/function counts + top categories |
| GET | `/api/v1/pcc-catalog/modules?limit=N` | Paginated module list |
| GET | `/api/v1/pcc-catalog/categories` | 255 category list |
| GET | `/api/v1/pcc-catalog/module/:slug` | Single module metadata |
| GET | `/api/v1/pcc-catalog/search?q=…` | Tokenized module search |
| GET | `/api/v1/pcc-catalog/lookup/:fn` | Reverse: function → modules |
| GET | `/api/v1/pcc-catalog/coverage` | Per-category coverage breakdown |
| GET | `/api/v1/pcc-catalog/duplicates` | Cross-module function duplicates |
| GET | `/api/v1/pcc-catalog/orphans` | Modules with declared/actual mismatches |
| GET | `/api/v1/pcc-catalog/random` | Random module picker |
| GET | `/api/v1/pcc-catalog/badge.svg` | shields.io-style dynamic badge |
| GET | `/api/v1/pcc-catalog/snapshots` | Daily snapshot index |
| POST | `/api/v1/pcc-catalog/api-token` | Issue bearer token |
| POST | `/api/v1/pcc-catalog/api-token/revoke` | Revoke token |
| POST | `/api/v1/pcc-catalog/api-token/refresh` | Rotate token |
| GET | `/api/v1/pcc-diagnostics/{diagnostics,version,coverage,bench/run}` | Health & load |
| GET | `/status/stream` | Server-Sent Events (uptime, p95, errors) |
| GET | `/api/v1/pcc-{slug}/list` · `/call/{fn}` · `/record` | 1322 × 3 module routes |

> **Total: ~4045 endpoints.** Full table in [ENDPOINTS.md](ENDPOINTS.md).

---

## Architecture

The PCC sandbox is a stateless Express service backed by PostgreSQL. Each of the
1322 module folders contains a deterministic engine file (`{slug}_engine.js`) and
a routes file (`{slug}_routes.js`) mounted at `/api/v1/pcc-{slug}`. The catalog is
discovered by scanning the filesystem at boot and frozen into an in-memory
`PCC_MODULES_LOOKUP` for fast lookups, plus a `PCC_SEARCH_INDEX` (tokenized
keyword → module slugs) and a `PCC_FUNC_INDEX` (function name → module slugs).
A ring-buffered in-memory audit log plus optional PG persistence track every
write; API tokens are stored hashed in PG with rotate / revoke semantics. The
GraphQL executor and in-browser playground are auto-generated from the catalog
metadata, and the public status page streams uptime via SSE.

See [`../docs/ARCHITECTURE_MAP_AR.md`](../docs/ARCHITECTURE_MAP_AR.md) for the
full multi-tenant hospital platform architecture (this sandbox is a sibling of
the `namaweb/` ERP, not a deployment target).

---

## SDKs

First-party SDKs under [`sdk/`](sdk/) cover the major stacks:

| Language | Path |
|---|---|
| TypeScript / Node.js | [`sdk/typescript/`](sdk/typescript/) · [`sdk/nodejs/`](sdk/nodejs/) |
| Python | [`sdk/python/`](sdk/python/) |
| Go | [`sdk/go/`](sdk/go/) |
| Ruby | [`sdk/ruby/`](sdk/ruby/) |
| PHP | [`sdk/php/`](sdk/php/) |
| Rust | [`sdk/rust/`](sdk/rust/) |
| Java | [`sdk/java/`](sdk/java/) |
| Swift | [`sdk/swift/`](sdk/swift/) |
| Kotlin | [`sdk/kotlin/`](sdk/kotlin/) |
| Postman collection | [`postman/PCC-Sandbox.postman_collection.json`](postman/) |
| Mock server (for SDK CI) | [`sdk/mock-server/`](sdk/mock-server/) |

---

## Operations

| Concern | Where |
|---|---|
| Deploy to `jumanasoft.com` | [`scripts/README_DEPLOY.md`](scripts/README_DEPLOY.md) |
| Deploy script (dry-run supported) | [`scripts/deploy_pcc_to_jumanasoft.sh`](scripts/deploy_pcc_to_jumanasoft.sh) |
| Health check | [`scripts/health_check.sh`](scripts/health_check.sh) |
| Smoke test | [`scripts/smoke_test.sh`](scripts/smoke_test.sh) |
| Daily snapshot | [`scripts/daily_snapshot.sh`](scripts/daily_snapshot.sh) |
| Seed demo data | [`scripts/seed_demo.js`](scripts/seed_demo.js) |
| Live runbook | [`RUNBOOK.md`](RUNBOOK.md) |

```bash
# dry-run a deploy
bash scripts/deploy_pcc_to_jumanasoft.sh --dry-run

# health + smoke after a deploy
bash scripts/health_check.sh
bash scripts/smoke_test.sh
```

---

## Monitoring

| Surface | Path | Format |
|---|---|---|
| Grafana dashboard | [`dashboards/pcc-overview.json`](dashboards/pcc-overview.json) | JSON (importable) |
| Prometheus alerts | [`alerts/pcc-alerts.yaml`](alerts/pcc-alerts.yaml) | 9 alert rules |
| Prometheus scrape | `GET /_metrics` | text/plain (openmetrics-ish) |
| Public status | `GET /status/` | HTML + RSS + JSON |
| Live SSE | `GET /status/stream` | `text/event-stream` |

The Grafana dashboard tracks: uptime, request rate, p50/p95/p99 latency, error
rate, per-tenant rate-limit hits, audit log size, and module-count drift.

---

## Contributing

This repository is **owner-gated**. The PCC catalog ships via the P3 phase
shipper pipeline (see [`SHIP_P3NF.md`](SHIP_P3NF.md) for the most recent phase).
Per-department changes follow the P3 canonical 4-file pattern
(`{slug}_engine.js` + `{slug}_routes.js` + `{slug}_test.js` + migration).

Before opening a PR:

1. Run `npm test` (engine tests, no DB)
2. Run `bash scripts/smoke_test.sh` against your local server
3. Update [CHANGELOG.md](CHANGELOG.md) under `[Unreleased]`
4. Read the 13 safety rails in the parent [`AGENTS.md`](../AGENTS.md):
   no hardcoded secrets, no PHI in fixtures, tenant isolation stays on,
   money routes stay idempotent, fail-closed on missing tenant context, etc.

---

## License

Proprietary — internal NamaMedical. See `LICENSE` (TBD).

---

## Support

Owner: `jumana@jumanasoft.com` (live) · on-call rota in [`RUNBOOK.md`](RUNBOOK.md).
For incident response, see the runbook's `## Incident` section.
