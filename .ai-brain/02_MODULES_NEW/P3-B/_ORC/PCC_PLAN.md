<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
phase: P3-C
title: PCC (Proof-of-Concept to Code) — CARD-007 Cath Lab Specialized
date: 2026-07-24
status: IN_PROGRESS
owner_signal: "شوف المناسب واعمله" (best-judgment)
dept: CARD-007
---

# P3-C PCC — Plan & Execution

## 1. Why CARD-007 Cath Lab Specialized

| Factor | Justification |
|---|---|
| **Complexity** | Very Complex (CTO, bifurcation, atherectomy, IVL, IVUS/OCT) — exercises the full engine surface |
| **High revenue** | Cath lab is the #1 revenue driver in any modern hospital |
| **Existing reference** | `cath_lab_engine.js` already exists in `namaweb/` from P3-A POC — we can extend, not duplicate |
| **Critical safety** | Red flags, contrast nephropathy, ACT monitoring — perfect test of P0 compliance |
| **NPHIES exposure** | Cath lab bills are the highest-stakes claims |

## 2. PCC Scope (sandbox, not live)

This PCC is **sandbox-only**. The new code lives under a **new
`pcc/`** directory that:

- Does **NOT** touch `namaweb/`, `namaweb-ovr-audit-independent/`, `ops/`, or `.env`
- Uses its **own** `pcc/server.js`, `pcc/db.js`, etc.
- Uses a **separate database** (`nama_pcc_sandbox`) — never the live DB
- Uses **dummy data only** — no PHI
- All safety rails apply (no secrets, no force-push, no prod DDL)
- Code is **production-quality** but **sandbox-deployed**

## 3. PCC Deliverables (6 files)

1. `pcc/server.js` — Express server with full middleware chain
2. `pcc/db.js` — pg pool, tenant context, RLS test fixtures
3. `pcc/engines/cath_lab_specialized_engine.js` — 10 functions, full implementation
4. `pcc/migrations/cath_lab_up.sql` — 4 tables with RLS + FORCE RLS
5. `pcc/routes/cath_lab.js` — 5 endpoints with auth + tenant + role + validate
6. `pcc/tests/cath_lab_test.js` — 8 unit + 5 integration tests

Plus:
- `pcc/README.md` — how to run the sandbox
- `pcc/PCC_CLOSEOUT.md` — what was built, what was tested, what was deferred

## 4. Safety Rails (reaffirmed for PCC)

1. ❌ Never touch `namaweb/`
2. ❌ Never run on the live DB (`204.168.144.74`)
3. ❌ No secrets in tracked files
4. ❌ No PHI in fixtures
5. ❌ No DDL on the production schema
6. ✅ All tables: `tenant_id UUID NOT NULL` + RLS + FORCE RLS
7. ✅ All routes: `requireAuth + requireTenantScope + requireRole + validateBody`
8. ✅ Idempotency on the 2 money routes
9. ✅ Audit log hash-chained
10. ✅ Money/VAT server-side only

## 5. Why This Is The "Best" Path

| Comparison | PCC (chosen) | L3 (alternative) | P4 (alternative) |
|---|---|---|---|
| **Time** | ~30-45 min | ~2-3 hours | ~2-3 hours |
| **Output** | 6 runnable files + tests | 176 doc edits | 1,700 new docs |
| **Real value** | **YES** — actual code | None (still docs) | None (still docs) |
| **Risk** | Low (sandbox) | None | None |
| **Demonstrates stack** | YES | No | No |
| **Reusable for next 21 depts** | YES (template) | Partial | Partial |
| **Owner can `npm test`** | **YES** | No | No |
| **Aligns with AGENTS.md** | ✅ (value path) | Partial | Partial |

## 6. PCC Methodology

For each of the 6 files:
1. **Logical analysis** — what does the spec say? what are the pitfalls?
2. **Quality self-review** — check against 12 safety rails
3. **Implementation** — full, complete, copy-pasteable code (no truncation)
4. **Test** — actually run the test, verify pass

## 7. Definition of Done

- [ ] All 6 files written, no truncation
- [ ] `npm test` passes
- [ ] Sandbox server starts without error
- [ ] At least 1 RLS test verifies cross-tenant isolation
- [ ] At least 1 idempotency test verifies duplicate-key handling
- [ ] PCC_CLOSEOUT.md documents what works, what's deferred
- [ ] No secrets, no PHI, no live-DB touches

---
*ORC: PCC scope agreed. Now executing.*
