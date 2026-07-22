# Urology — Batch 2 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

## 1. CMO

### Clinical Scope
- **Mission:** General urology, endourology/stone, uro-onc, peds, andrology, female/reconstructive
- **Top 5:** N20.0 (Renal stone), C61 (Prostate Ca), C64.9 (Renal Ca), N40.0 (BPH), C67.9 (Bladder Ca)
- **Care bundles:** Stone prevention, post-prostatectomy incontinence, BCG compliance
- **Red flags:** Testicular torsion, Fournier gangrene, sepsis from obstructed stone, cord compression

### Sub-units
1. General Urology
2. Endourology & Stone Disease
3. Urologic Oncology (prostate, bladder, kidney)
4. Pediatric Urology
5. Andrology
6. Female Urology & Urodynamics
7. Reconstructive Urology

## 2. AI Engineer
- RAG: AUA, EAU, SUO
- Engines: `ipss_score.js`, `psa_trend.js`, `stone_recurrence_risk.js`

## 3. Architect
- API: POST `/api/urology/cds/ipss`, `/cds/stone_recurrence`
- Tables: `urology_cases`, `psa_tracking`, `urodynamics`

## 4. DevOps
- RLS, encrypted op notes
- Audit every procedure (CPT)

## 5. PM/UX
- Sub-tabs: General, Stone, Onc, Peds, Andro, Female, Recon
- 3-col Layout A

## 6. Compliance
- CBAHI, JCI, AUA, EAU

## KPIs
1. Stone clearance rate ≥85%
2. Post-prostatectomy continence ≥85% (12m)
3. BCG compliance ≥80% (NMIBC)
4. Op note within 24h ≥99%
5. 30-day readmit ≤5%
