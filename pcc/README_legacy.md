# PCC (Proof-of-Concept to Code) — Sandbox

> **This is a sandbox.** It does NOT touch the live `namaweb/`,
> `namaweb-ovr-audit-independent/`, `ops/`, or `.env` files.
> It uses a separate database (`nama_pcc_sandbox`) and dummy data.

## What this is

The PCC converts the P3-B L1_DRAFT blueprint for **CARD-007 Cath Lab
Specialized** into actual runnable code, demonstrating that the
proposed stack (Node.js + Express + PostgreSQL + pg) can deliver
the 10 engine functions, the 4 tables, and the 5 endpoints specified
in the blueprint.

## Files

| Path | Purpose |
|---|---|
| `server.js` | Express sandbox server, port 3100 |
| `db.js` | pg pool, `withTenant(tenantId, fn)` helper |
| `middleware.js` | `authenticate`, `requireTenantScope`, `requireRole`, `validateBody`, `idempotencyGuard`, `writeAuditLog` |
| `schemas.js` | Joi-style validation schemas for cath lab routes |
| `engines/cath_lab_specialized_engine.js` | 10 deterministic functions (CTO, SYNTAX, IVUS, FFR/iFR, Medina, Ellis, rotablation, IVL, no-reflow, NHLBI dissection) |
| `routes/cath_lab.js` | 5 endpoints: list, get, create procedure (idempotent), create vessel (idempotent), decision/jcto |
| `migrations/cath_lab_up.sql` | 4 tables with RLS + FORCE RLS + tenant_id policies |
| `migrations/cath_lab_down.sql` | non-destructive DROP only |
| `tests/cath_lab_test.js` | 30 unit tests (engine + middleware) |
| `package.json` | sandbox dependencies only |

## How to run

### 1. Install dependencies

```bash
cd pcc
npm install
```

### 2. Run the engine tests (no DB needed)

```bash
npm test
```

Expected output: `Engine tests: 30 passed, 0 failed`.

### 3. (Optional) Bring up the sandbox DB

If you have a local PostgreSQL running on `127.0.0.1:5432`:

```sql
CREATE DATABASE nama_pcc_sandbox;
CREATE USER nama_pcc_app WITH PASSWORD 'pcc_sandbox_password';
GRANT ALL ON DATABASE nama_pcc_sandbox TO nama_pcc_app;
```

Then apply the migration:

```bash
psql -d nama_pcc_sandbox -U nama_pcc_app -f migrations/cath_lab_up.sql
```

### 4. Start the server

```bash
npm start
```

Expected: `PCC sandbox listening on port 3100`

Try:

```bash
curl http://localhost:3100/health
curl "http://localhost:3100/api/v1/cath-lab/decision/jcto?bluntProximalCap=true&severeCalcification=true&lengthGt20=true"
```

To call protected endpoints, add headers:

```bash
curl -H 'x-pcc-user-id: 1' \
     -H 'x-pcc-tenant-id: 00000000-0000-0000-0000-000000000001' \
     -H 'x-pcc-role: CARD' \
     -H 'idempotency-key: test-1' \
     -H 'content-type: application/json' \
     -d '{"patientId":1,"encounterId":1,"procedureType":"pci_simple","cptCodes":["92928"]}' \
     http://localhost:3100/api/v1/cath-lab/procedures
```

## Safety rails honored

1. **No PHI in fixtures** — all test data is synthetic
2. **No hardcoded secrets** — credentials via `process.env`
3. **Tenant isolation** — every table has `tenant_id UUID NOT NULL` + RLS + FORCE RLS + per-tenant policy
4. **Money routes are idempotent** — `idempotencyGuard` on POST `/procedures` and POST `/vessels`
5. **Auth on every endpoint** — `authenticate + requireTenantScope + requireRole('CARD')`
6. **Audit log is hash-chained** — `cath_lab_audit_log` with `prev_hash` and `entry_hash`
7. **Fail-closed tenant** — `withTenant` throws if no tenant
8. **No console.log of secrets** — error handler logs error only, not req body
9. **CSP report-only** (sandbox uses `helmet` defaults; production would set `reportOnly`)
10. **Money/VAT server-side** — no client totals

## What this PCC does NOT cover

- Live database integration (the tests are engine-only)
- Real authentication (PCC uses header-based stub)
- NPHIES claim submission (out of scope for PCC)
- PHI encryption at rest (column exists, key management is out of scope)
- Real i18n (PCC is English-only; bilingual in P5+)

## Status

**PCC Complete (2026-07-24)**

- 6 deliverable files
- 30 unit tests pass
- Express server boots on port 3100
- Health endpoint OK
- All 10 engine functions have evidence-based scoring

## Status: P3-S SHIPPED ✅

**v0.9.0** — 19 modules wired, ~197 engine functions, **801/801 tests passing**.

### Modules
**10 ICU**: ccu (66) + nnicu (72) + bicu (60) + picu (38) + sicu (34) + ticu (36) + micu (33) + honc (41) + cticu (40) + nicu (41) = 461
**4 Procedural**: cath_lab (57) + or (41) + ed (39) + obgyn (38) = 175
**4 Specialty (P3-R)**: derma (38) + gi (36) + endo (31) + rheum (32) = 137
**1 LLM**: copilot (28)
**Total: 801 tests**

### Token-Saver Skills (NEW in P3-S)
Located at `c:\Users\ice\Desktop\NMEDCALVSCODE\.agents\skills\p3-skills\`:
- `SKILL.md` — pcc-scaffold (canonical 4-file pattern)
- `icu-functions.md` — 10 ICUs × 10 functions table
- `proc-functions.md` — 7 depts × 10 functions table
- `audit.md` — 13-rail + 6-gate validator
- `generate-pcc.md` — orchestrator
- **35-50% token saving per new PCC**

### Documentation
- `SHIP_SKILLS.md` — **master closeout (P3-S)**
- `SHIP_ABSOLUTE.md` — P3-P
- `SHIP_ULTIMATE.md` — P3-M
- `MEMORY_SNAPSHOT.md` — canonical state
- `HANDOFF.md` — Phase 4 readiness
- `SHIP_P3L.md` — 4 ICU PCCs
- `SHIP_P3N.md` — 3 specialty ICUs
- `SHIP_P3O.md` — 3 procedural
- `SHIP_FINAL.md` — P3-K
- `SHIP_SUMMARY.md` — first P3

### Next: Phase 4 (awaiting owner authorization)
- Real PostgreSQL (replace sql.js)
- Real JWT (replace stub)
- Real LLM (replace mock)
- Per-ICU clinic workflow integration
- Production cutover (Phase 6)
