# MASTER EXECUTION PLAN — 2026-08-09

## الهدف
تنفيذ خطة شاملة كاملة باستخدام Autopilot + Loop Engineering + Multi-Agent مع تقليل استهلاك التوكنز عبر Skills.

## baseline (verified)
- Safe tests: 191/191 PASS
- Engines: 102 valid
- Routers: 63 valid
- Stations: 60 valid
- Migrations: 513
- Safety rails: 13/13 enforced

## Autopilot Activation (live)
- Mode: `AUTOPILOT_ACTIVE`
- Loop Engineering: enabled, max 4 loops/phase
- Multi-Agent: enabled (6 lanes)
- Token-saver skills: active
- Stop policy: fail-closed on first blocking gate failure

## Active Multi-Agent Lanes
- DB_MIGRATIONS
- BACKEND_API
- FRONTEND_STATION
- QA_SECURITY
- OPS_OBSERVABILITY
- DOCS_COMPLIANCE

## Phase-C Bundle Gate (new)
- Added `namaweb/wave53_phasec_bundle_test.js` as a unified gate for:
  - `e3_lis_guard_test.js`
  - `lis_autoverify_test.js`
  - `e4_radiology_guard_test.js`
  - `wave53_phasec_loinc_interop_test.js`
- Current result: PASS (plus HL7↔LOINC bridge test)

## Phase-D Bundle Gate (new)
- Added `namaweb/wave53_phased_bundle_test.js` as a unified Ops/Observability gate for:
  - `wave41_dr_drill_test.js`
  - `wave42_process_lifecycle_test.js`
  - `wave43_error_handler_test.js`
  - `wave44_http_request_metrics_test.js`
  - `wave45_db_pool_metrics_test.js`
  - `wave46_metrics_aggregator_test.js`
  - `wave47_aggregator_extension_test.js`
  - `wave48_security_aggregator_test.js`
  - `wave49_scrape_latency_test.js`
- Current result: PASS

## Phase-E Bundle Gate (new)
- Added `namaweb/wave53_phasee_bundle_test.js` as a unified compliance/closeout gate for:
  - `no_hardcoded_secrets_test.js`
  - `rbac_guards_test.js`
  - `rbac_phi_guard_test.js`
  - `wave0_server_rbac_static_test.js`
  - `staging_readiness_design_test.js`
  - `staging_provisioning_evidence_test.js`
  - `staging_gaps_remediation_plan_test.js`
  - `owner_staging_handoff_test.js`
- Current result: PASS

## Wave 53 execution status
- Phase A: Closed
- Phase B: Closed
- Phase C: Closed
- Phase D: Closed
- Phase E: Closed (local evidence complete; external prod credentials still owner-blocked)

## phase map (A→E)

### Phase A — Discovery + Data Hardening
- مخرجات:
  - تحديث ERD + gap map
  - تطبيق seed migration e61 وتوثيقه
  - توحيد فهارس tenant_id على الجداول الحساسة
- Quality gates:
  - QG-A1: لا secrets hardcoded
  - QG-A2: RLS coverage unchanged or improved
  - QG-A3: migration reversible (up/down)

### Phase B — Core Clinical + Revenue gaps (P1 critical)
- مخرجات:
  - EMR lock/signature enforcement
  - DDI engine data seeding and guard rails
  - BCMA server-side 5-rights validation
  - GL posting toggle + integrity checks
- Quality gates:
  - QG-B1: unit/integration tests added
  - QG-B2: idempotency intact for money routes
  - QG-B3: no PHI logging regressions

### Phase C — Interop + Imaging + UX
- مخرجات:
  - LOINC mapping skeleton + HL7 ORU parser baseline
  - PACS adapter contract + viewer placeholder secure
  - Admin panel phase-2 widgets (audit/compliance/live metrics)
- Quality gates:
  - QG-C1: OpenAPI updated
  - QG-C2: i18n AR/EN coverage for new screens
  - QG-C3: accessibility static checks pass

### Phase D — Ops + Observability + DR
- مخرجات:
  - Grafana dashboards wired in ops docs
  - alert thresholds for rail violations
  - restore drill script validation
- Quality gates:
  - QG-D1: smoke scripts pass
  - QG-D2: audit chain verification passes
  - QG-D3: backup/restore evidence logged

### Phase E — Compliance + Closeout + Release packet
- مخرجات:
  - HIPAA/PDPL/NPHIES/ZATCA compliance matrix refresh
  - Final release checklist + rollback plan
  - final closeout report + changelog wave entry
- Quality gates:
  - QG-E1: all non-DB tests green
  - QG-E2: doc evidence links present
  - QG-E3: unresolved blockers clearly declared

## loop engineering policy
- لكل phase حتى 4 loops كحد أقصى:
  - L1 Plan
  - L2 Implement
  - L3 Test
  - L4 Verify
- عند فشل loop 4: escalate owner decision.

## multi-agent split
- Agent-1: DB/Migrations
- Agent-2: Backend/API
- Agent-3: Frontend/Station
- Agent-4: QA/Security
- Agent-5: Ops/Observability
- Agent-6: Docs/Compliance
- Orchestrator merges outputs per loop.

## skill activation order
1. nm-token-saver-pack-v2
2. nm-loop-engineering-v2
3. nm-autopilot-wave-runner-v1
4. nm-multi-agent-wave-splitter-v1
5. nm-loop-gate-enforcer-v1
6. nm-final-ship-pack

## token budget envelope
- Target total per phase: 2.5k–4k tokens
- Whole wave target (A→E): <= 17k tokens
- Hard ceiling: 22k tokens

## immediate next wave (Wave 53)
1. P1-1 EMR lock/signature
2. P1-4 DDI data + checks
3. P1-9 audit seed + verify
4. P1-10 GL posting safety toggle

## blockers (owner)
- ZATCA production CSID/OTP
- NPHIES production credentials
- Payment gateway production keys
