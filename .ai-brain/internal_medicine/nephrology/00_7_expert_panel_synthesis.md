# Nephrology — Batch 1 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

## 1. CMO Input

### Clinical Scope
- **Mission:** Kidney care + dialysis + transplant
- **Top 5:** N18.3 (CKD3), N18.4 (CKD4), N18.5 (CKD5), Z99.2 (HD), Z94.0 (Transplant)
- **Care bundles:** CKD bundle (BP, ACE-i/ARB, statin, glucose, avoid nephrotoxins)
- **Red flags:** K>6.5, uremic encephalopathy, fluid overload, acidosis

### Sub-units
1. CKD clinic (stages 1-5)
2. Hemodialysis unit
3. Peritoneal Dialysis
4. Renal Transplant
5. Plasmapheresis
6. Pediatric Dialysis

## 2. AI Engineer

### Engines
- `ckd_progression_engine.js` (KFRE — 2- and 5-year ESRD risk)
- `hd_adequacy_engine.js` (Kt/V, URR)
- `transplant_engine.js` (KDPI/EPTS)

## 3. Architect

### API
- POST `/api/nephrology/cds/kfre`
- POST `/api/nephrology/cds/kt_v`
- GET `/api/nephrology/cohorts/ckd4`, `/transplant_waitlist`

## 4. DevOps
- RLS, encrypted labs
- Audit every dialysis session start/stop

## 5. PM/UX
- Layout D (chart-heavy for eGFR trend, dialysis adequacy)
- Sub-tabs: CKD, HD, PD, Transplant, Plasmapheresis

## 6. Compliance
- CBAHI APR, Saudi MoH transplant regulations
- OPTN/Eurotransplant alignment

## KPIs
1. Kt/V ≥1.2 in ≥90% HD
2. AVF use ≥70% (vs CVC)
3. Transplant waitlist mortality ≤5%
4. 1-year graft survival ≥90%
5. Hospitalization <1.5/HD-pt-year

## New files (this batch)
- Synthesis
