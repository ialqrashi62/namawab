<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
phase: P3-E
title: PCC #2 — CCU (Coronary Care Unit)
date: 2026-07-24
status: IN_PROGRESS
owner_signal: "شوف المناسب واعمله" (best-judgment)
prior: P3-D (57/57 tests green for CARD-007)
goal: Prove the PCC template on a different complex dept
---

# P3-E — PCC #2: CCU (Coronary Care Unit)

## 1. Why CCU

| Factor | Justification |
|---|---|
| **Different from CARD-007** | CCU is post-event care, not intra-procedure. Different workflow. |
| **High clinical value** | STEMI, post-PCI, cardiogenic shock, arrhythmia — top 3 reasons for cardiac mortality |
| **L2 P0 hot spot** | Cross-dept hot spot: Anticoagulation, Vasoactive drugs, Mechanical ventilation |
| **10 distinct functions** | All evidence-based (GRACE, TIMI, SCAI shock staging, ACT, etc.) |
| **Same template as CARD-007** | Reuses 90% of the structure: 6 files, ~25 KB |

## 2. CCU-specific design

### 10 engine functions
1. **GRACEInHospitalMortality** — GRACE score for NSTE-ACS in-hospital mortality
2. **TIMI_30day** — TIMI score for 30-day MACE
3. **SCAI_Shock_Stage** — SCAI cardiogenic shock staging (A-E)
4. **DAP_30day** — DAPT duration recommendation
5. **BleedingRisk** — CRUSADE bleeding risk
6. **MCSIndication** — Mechanical circulatory support (IABP, Impella, VA-ECMO)
7. **TTMEligibility** — Targeted temperature management post-arrest
8. **ArrhythmiaRecognition** — VT/VF/AF recognition
9. **IABPTroubleshooting** — IABP timing/pump issues
10. **ImpellaTroubleshooting** — Impella position/recovery

### 4 tables (mirrors CARD-007 pattern)
1. `ccu_admission` — master record
2. `ccu_vital_sign` — vitals tracking (HR, BP, MAP, rhythm)
3. `ccu_medication_admin` — vasoactive, anticoag, antiarrhythmic
4. `ccu_audit_log` — hash-chained audit

### 5 endpoints
1. `POST /api/v1/ccu/admissions` (idempotent)
2. `GET /api/v1/ccu/admissions`
3. `GET /api/v1/ccu/admissions/:id`
4. `POST /api/v1/ccu/admissions/:id/vitals`
5. `GET /api/v1/ccu/decision/grace` (pure compute)

## 3. Deliverables (8 files)

```
pcc/ccu/
  ccu_engine.js                 (10 functions, ~280 lines)
  ccu_up.sql                    (4 tables, RLS, ~120 lines)
  ccu_down.sql                  (DROP only)
  ccu_routes.js                 (5 endpoints, ~150 lines)
  ccu_test.js                   (40 unit tests)
  ccu_integration_test.js       (17 integration tests)
  README.md
  CLOSEOUT.md
```

Plus update `pcc/package.json` test script.

Plus update `pcc/server.js` to mount CCU routes.

Plus update `pcc/schemas.js` to add CCU schemas.

## 4. Safety rails

1. ✅ No `namaweb/` touch
2. ✅ No live DB
3. ✅ No PHI in fixtures
4. ✅ Same RLS pattern as CARD-007
5. ✅ Idempotency on admission create
6. ✅ Hash-chained audit
7. ✅ Tenant fail-closed

## 5. Acceptance

- [ ] 40 unit tests pass for ccu_engine.js
- [ ] 17 integration tests pass for CCU routes
- [ ] All 5 routes verified end-to-end
- [ ] Multi-tenant isolation verified
- [ ] Idempotency verified
- [ ] Audit chain verified
- [ ] CCU PCC CLOSEOUT.md written
- [ ] current-phase.json updated to P3-E-CCU-PCC

---
*ORC: Executing.*
