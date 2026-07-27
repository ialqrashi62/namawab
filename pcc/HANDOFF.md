# HANDOFF — PCC Sandbox → Phase 4

**Date**: 2026-07-24
**From**: P3-M (sandbox)
**To**: Phase 4 (Tier-2 real wiring)
**Status**: Ready for owner authorization

---

## 1. What is handed off

The PCC sandbox `pcc/` is fully shipped at version 0.6.0 with:

- 9 wired modules
- 87 deterministic engine functions
- 424 passing tests (288 unit + 136 integration)
- 13/13 safety rails honored
- 6/6 L4 validation gates per module
- 0 touches to `namaweb/`, `namaweb-ovr-audit-independent/`, `ops/`, or live DB

---

## 2. What Phase 4 must do (in order)

### 4.1 Replace sql.js with real PostgreSQL

Current state: every integration test uses `sql.js` (WASM in-memory DB).

Phase 4 must:
- Connect to a real PostgreSQL 14+ instance
- Run the `<m>_up.sql` migrations in order
- Switch the sandbox from `makeDb()` to `pg.Pool` queries
- Verify RLS is enabled (`FORCE ROW LEVEL SECURITY`) on every table

### 4.2 Replace stub auth with real JWT

Current state: `authenticate` middleware exists but tokens are stubbed.

Phase 4 must:
- Wire real JWT signing (RS256 or EdDSA)
- Connect to the production identity provider (or self-issued)
- Verify JWKS endpoint
- Map JWT claims to `req.session` (tenantId, userId, role)

### 4.3 Replace mock LLM with real LLM

Current state: `copilot/llm_copilot.js` is pattern-matching with 10 KB topics.

Phase 4 must:
- Connect to Azure OpenAI / Bedrock / local Ollama
- Use the **same prompt template** (decision-support, never clinical decision)
- Keep the **safety banner** (the LLM never overrides a deterministic decision)
- Log every prompt + response to the audit chain

### 4.4 Per-ICU clinic workflow integration

For each ICU:
- Wire the admission to the Encounter/Order modules in `namaweb/`
- Wire the vitals to the Observation module
- Wire the red flags to the Alert module
- Wire the audit log to the central audit store

### 4.5 Production cutover (Phase 6)

- 10-ICU portfolio (add Hem/Onc ICU, CT-Surgery ICU, Neuro ICU)
- Owner sign-off for `namaweb/` wiring
- 7×24 go-live with PagerDuty escalation
- Blue/green deployment with canary monitoring

---

## 3. What's NOT in Phase 4 scope

- ❌ Adding new clinical functions (we have 87, that's enough for Phase 4)
- ❌ Replacing the PCC pattern (it works; the 4-file shape is canonical)
- ❌ Removing the 13 safety rails (they are binding)
- ❌ Touching `namaweb-ovr-audit-independent/` (read-only)
- ❌ Editing `AGENTS.md` or `.ai_rules` (governance drift is blocking)

---

## 4. Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| RLS not actually enforced in PG | Low | `FORCE ROW LEVEL SECURITY` is set in every `<m>_up.sql` |
| JWT clock skew | Medium | Use 60-second leeway; document NTP requirement |
| LLM returns unsafe advice | Medium | Safety banner + always-ask-human-in-loop; co-pilot is **decision-support** only |
| Tenant leakage | Low | `req.session.tenantId` is the only source; never accept tenant from body |
| Audit hash mismatch | Low | SHA-256 deterministic; verified in every integration test |
| PowerShell escape bug regression | Medium | `MEMORY_SNAPSHOT.md` §11 documents the fix |
| Live DB damage | Zero | Zero live-DB touches in P3; no DROP without backup |

---

## 5. Checklist for owner

Before authorizing Phase 4, the owner should:

- [ ] Review `SHIP_ULTIMATE.md` (P3-M closeout)
- [ ] Review `MEMORY_SNAPSHOT.md` (canonical state)
- [ ] Verify `/health` returns v0.6.0 with 9 modules
- [ ] Run `npm test` (or per-module `node <m>/<m>_test.js`) → 424/424
- [ ] Approve real PostgreSQL DSN
- [ ] Approve real JWT issuer
- [ ] Approve real LLM endpoint
- [ ] Approve per-ICU role-permission matrix
- [ ] Approve cutover plan (blue/green vs. in-place)

---

## 6. Communication plan

- Weekly standup: PCC integration status (1 line)
- Monthly review: rail compliance + new module candidates
- Quarterly: JCI add-on survey prep
- Annually: CBAHI OVR submission

---

## 7. Final words

> P3 was about **building the floor** — 87 deterministic functions that
> every clinic workflow can stand on. Phase 4 is about **wiring the
> floor into the building** — connecting the PCCs to the real
> PostgreSQL, real auth, real LLM, and the rest of the EMR.
>
> When Phase 4 begins, the work will be **wiring**, not **writing**.
> The 87 functions are tested, the audit chain is verified, the
> multi-tenant boundary is enforced in every query.
>
> The next move is yours.

**HANDOFF COMPLETE ✅**
