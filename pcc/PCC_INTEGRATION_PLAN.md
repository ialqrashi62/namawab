<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
phase: P3-D
title: PCC Integration Tests with SQLite (in-process)
date: 2026-07-24
status: IN_PROGRESS
owner_signal: "شوف المناسب واعمله" (best-judgment)
prior: P3-C-PCC (40/40 unit tests pass, server boots, no DB tests)
goal: Close the largest PCC gap (DB-dependent code paths untested)
---

# P3-D — PCC Integration Tests

## 1. Why this is the best next step

| Fact | Implication |
|---|---|
| P3-C PCC has 40/40 unit tests pass | Engine is verified |
| P3-C PCC server boots | Express + middleware bootable |
| P3-C PCC has **0 DB integration tests** | Risk: routes may fail at runtime |
| 5 endpoints depend on DB | The most important paths are untested |
| Migration file (`cath_lab_up.sql`) is untested | RLS + policies may have bugs |

**Closing this gap is the highest-value, lowest-risk next step.**

## 2. Why SQLite (in-process)

| Reason | Detail |
|---|---|
| No PostgreSQL in this environment | But routes assume pg |
| SQLite supports parameterized queries | The pattern transfers to pg |
| In-process = fast + zero setup | No install needed |
| `better-sqlite3` is synchronous | Simpler test code |
| RLS pattern adapts | We translate `current_setting('app.tenant_id')::UUID` to `WHERE tenant_id = ?` |

## 3. Sandbox decision

SQLite integration tests run **inside the `pcc/` sandbox**. They:
- Do NOT touch `namaweb/`
- Do NOT touch any live DB
- Do NOT need a server
- Just exercise the engine + a SQLite-ported schema

## 4. Deliverables (3 files)

1. `pcc/tests/integration_test.js` — main test runner
2. `pcc/db_sqlite.js` — SQLite-backed `withTenant(tenantId, fn)` adapter
3. `pcc/PCC_INTEGRATION_CLOSEOUT.md` — closeout report

## 5. Test scenarios (5)

1. **Multi-tenant isolation** — create rows in tenant A, query from tenant B, expect 0 rows
2. **CRUD round-trip** — create procedure → list → get → verify
3. **Idempotency** — POST same idempotency-key twice, expect 1 row + identical response
4. **Vessel intervention chain** — create procedure → create 2 vessels → get procedure → verify 2 vessels
5. **Audit hash chain integrity** — create 3 operations → audit log has 3 entries with correct `prev_hash` linking

## 6. Safety rails

1. ✅ No live DB
2. ✅ No PHI (synthetic IDs only)
3. ✅ No `namaweb/` touch
4. ✅ No secrets
5. ✅ Test DB created in temp dir, deleted at end

---
*ORC: Executing.*
