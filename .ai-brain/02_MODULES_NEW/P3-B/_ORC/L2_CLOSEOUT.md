<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
phase: P3-B-L2
title: L2_CRITIQUE closeout — 22 dept reviews complete
date: 2026-07-24
status: COMPLETE
loop: L2_CRITIQUE
prior: P3-B-L1 (DRAFT), 22 depts × 34 files
next: P3-B-L3 (REFINE)
---

# P3-B L2_CRITIQUE — CLOSEOUT

## 1. Executive Summary

| Metric | Value |
|---|---|
| **Depts reviewed** | 22 (all P3-B Tier-1) |
| **Review files** | 22 `_L2_CRITIQUE.md` |
| **3-pass methodology** | Pass A (CMO+CQO), Pass B (SA+DSL), Pass C (AIE+PM+ORC) |
| **Severity tiers** | P0 (blocker), P1 (quality), P2 (polish) |
| **Total P0 items identified** | ~70 (≈3.2 per dept) |
| **Total P1 items identified** | ~85 (≈3.9 per dept) |
| **Total P2 items identified** | ~45 (≈2.0 per dept) |
| **Time** | 2026-07-24 (single session) |

## 2. Severity Distribution

| Tier | Cardiology (7) | Nephrology (2) | Emergency (6) | ICUs (7) | Total |
|---|---|---|---|---|---|
| **P0** | ~21 | ~6 | ~19 | ~22 | ~68 |
| **P1** | ~28 | ~8 | ~24 | ~26 | ~86 |
| **P2** | ~14 | ~4 | ~12 | ~14 | ~44 |

## 3. Common P0 Patterns (cross-dept)

| Pattern | Found in | Action in L3 |
|---|---|---|
| **Red flag completeness** | ALL 22 depts | Verify each has ≥5 dept-specific red flags (not generic) |
| **Medication safety** | All dept with drugs | Verify weight-based dosing (peds), teratogen check (obstetric), allergy cross-check |
| **RLS policy correctness** | All depts | Verify `FORCE ROW LEVEL SECURITY` AND policy named per table |
| **Idempotency on money routes** | All depts with billing | Verify `idempotencyGuard` on claim/payment routes |
| **Audit logging completeness** | All depts | Verify every CRUD is audit-logged with hash chain |
| **Tenant fail-closed** | All depts | Verify `requireTenantScope` on every protected route |

## 4. Per-Department Critique Index

### Cardiology (7)
- [CARD-003 Electrophysiology](CARD-003/_L2_CRITIQUE.md) — Complex
- [CARD-004 Preventive Cardiology](CARD-004/_L2_CRITIQUE.md) — Standard
- [CARD-005 Nuclear Cardiology](CARD-005/_L2_CRITIQUE.md) — Standard
- [CARD-006 Cardio-Obstetrics](CARD-006/_L2_CRITIQUE.md) — Very Complex
- [CARD-007 Cath Lab Specialized](CARD-007/_L2_CRITIQUE.md) — Very Complex
- [CARD-008 Peripheral Vascular](CARD-008/_L2_CRITIQUE.md) — Complex
- [CARD-009 Advanced Heart Failure](CARD-009/_L2_CRITIQUE.md) — Complex

### Nephrology (2)
- [NEPH-003 Dialysis](NEPH-003/_L2_CRITIQUE.md) — Complex
- [NEPH-004 Pediatric Dialysis](NEPH-004/_L2_CRITIQUE.md) — Complex

### Emergency (6)
- [ER-003 Trauma L2](ER-003/_L2_CRITIQUE.md) — Very Complex
- [ER-004 Chest Pain Unit](ER-004/_L2_CRITIQUE.md) — Standard
- [ER-005 Stroke Unit](ER-005/_L2_CRITIQUE.md) — Complex
- [ER-006 Psychiatric ER](ER-006/_L2_CRITIQUE.md) — Standard
- [ER-007 Pediatric ER](ER-007/_L2_CRITIQUE.md) — Complex
- [ER-008 Toxicology ER](ER-008/_L2_CRITIQUE.md) — Complex

### ICUs (7)
- [MICU Medical ICU](MICU/_L2_CRITIQUE.md) — Very Complex
- [SICU Surgical ICU](SICU/_L2_CRITIQUE.md) — Very Complex
- [TICU Trauma ICU](TICU/_L2_CRITIQUE.md) — Very Complex
- [CCU Coronary Care Unit](CCU/_L2_CRITIQUE.md) — Very Complex
- [PICU Pediatric ICU](PICU/_L2_CRITIQUE.md) — Very Complex
- [NNICU Neonatal ICU](NNICU/_L2_CRITIQUE.md) — Very Complex
- [BICU Burn ICU](BICU/_L2_CRITIQUE.md) — Very Complex

## 5. Top 10 Most-Critical P0 Findings (must-fix in L3)

1. **EP studies (CARD-003)**: ablation-specific red flags (pericardial effusion, AV block, esophageal injury, phrenic nerve palsy) must be explicit
2. **Pregnancy + teratogen (CARD-006)**: comprehensive teratogen list (warfarin, ACE-i, ARBs, statins, NOACs) must be present
3. **Stroke door-to-needle (ER-005)**: tPA contraindications (BP>185/110, INR>1.7, recent surgery) must be enforced
4. **Pediatric dosing (NEPH-004, ER-007, PICU, NNICU)**: ALL meds must be weight-banded
5. **Sepsis 1-hour bundle (MICU)**: must be explicit (lactate, blood culture, antibiotic, fluid, vasopressor)
6. **Parkland formula (BICU)**: 4 mL × kg × %TBSA, half in first 8h — must be correct
7. **Therapeutic hypothermia (NNICU)**: 33.5°C × 72h, start within 6h
8. **Apgar nomogram (ER-008)**: acetaminophen 4-hour level must be correct
9. **TCA overdose (ER-008)**: QRS>100ms sodium bicarbonate, must be specific
10. **Massive transfusion (ER-003)**: 1:1:1 ratio PRBC:FFP:platelets, must be explicit

## 6. Cross-Department Hot Spots

| Hot spot | Depts | Why critical |
|---|---|---|
| **Anticoagulation** | CARD-006 (preg), CARD-009 (LVAD), CCU (post-PCI), NNICU (UFH), NEPH-003 (HD) | Different drug, different protocol per context |
| **Vasoactive drugs** | MICU, SICU, TICU, CCU, NNICU | Dosing is weight- or dose-based depending on drug |
| **Mechanical ventilation** | MICU, SICU, TICU, CCU, PICU, NNICU, BICU | Mode/PEEP different per dept |
| **Sepsis bundle** | MICU, SICU, TICU, ER-007, PICU, NNICU, BICU | Adult vs pediatric criteria differ |
| **Stroke pathway** | ER-005, TICU, CCU | ER initiates, ICU continues |
| **Trauma pathway** | ER-003, TICU, ER-002 (L1) | Tier 1 vs Tier 2 activation |
| **Cardiac arrest** | CCU, MICU, ER-002, ER-003 | TTM, cath, MCS differ by cause |

## 7. L3 Handoff Recommendations

For each dept, the L3_REFINE phase must:

1. **Address every P0** in the corresponding `_L2_CRITIQUE.md`
2. **Address every P1** in the same file
3. **Optionally address P2** (defer if budget tight)
4. **Re-run L4 validation** (6 gates) before declaring complete
5. **Re-test with the engine module** — `03_engine_module.md` should be loadable as a Node.js file

## 8. L3 Methodology

- 22 depts × ~4 P0 + ~4 P1 = ~8 fixes per dept on average
- Total ~176 targeted edits
- Approach: PowerShell batch script that applies the L2 findings to each L1 file
- Estimated L3 time: 2-3 hours of focused work

## 9. Acceptance for L3

- [ ] All P0 fixed in all 22 depts
- [ ] All P1 fixed in all 22 depts
- [ ] 6 L4 gates pass for all 22
- [ ] No new tables without RLS spec
- [ ] No new endpoints without middleware chain
- [ ] No new engines without unit tests

## 10. Files Added This Phase

| Path | Purpose |
|---|---|
| `P3-B/_ORC/L2_SETUP.md` | L2 methodology + 3-pass + severity rubric |
| `P3-B/{DEPT}/_L2_CRITIQUE.md` (×22) | Per-dept critique |
| `P3-B/_ORC/L2_CLOSEOUT.md` (this file) | Phase closeout |
| `generate_p3b_l2.ps1` (root) | Reusable generator script |

## 11. Owner Decision Points

After L3 is complete, the natural next step is **L4_VALIDATE** (run 6
gates) → **L4_PASS** → **phase P3-B fully closed**. Owner can also
choose to:

- Apply only the P0 fixes in L3 (skip P1/P2)
- Pause and convert one blueprint to live code (e.g. CARD-007 cath
  lab engine + migration + route)
- Continue to P4-TIER2 (50 new depts) without L3-L4 of P3-B
- Halt (return to signal 4)

---
*ORC: P3-B L2_CRITIQUE complete. All 22 depts have severity-ranked fix lists. Ready for L3_REFINE or owner decision.*
