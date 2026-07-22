# Dermatology — Batch 1 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

## 1. CMO Input

### Clinical Scope
- **Mission:** Skin + cosmetic + dermatosurgery + derm-onc + phototherapy
- **Top 5:** L40.9 (Psoriasis), L20.9 (Atopic derm), L70.0 (Acne), C44.91 (BCC), C43.9 (Melanoma)
- **Care bundles:** Psoriasis severity, melanoma excisions, biologic safety
- **Red flags:** Melanoma, SJS/TEN, severe drug reaction, pemphigus, angioedema

### Sub-units
1. General derm
2. Cosmetic derm
3. Dermatosurgery (Mohs, excisions)
4. Dermatologic oncology
5. Phototherapy
6. Pediatric derm

## 2. AI Engineer

### Engines
- `psoriasis_severity_engine.js` (PASI, BSA)
- `melanoma_risk_engine.js` (Breslow, TNM)
- `acne_severity_engine.js` (Leeds, GAGS)
- `drug_reaction_engine.js` (severity, SJS/TEN screening)

## 3. Architect

### API
- POST `/api/derm/cds/pasi`
- POST `/api/derm/cds/melanoma_stage`
- POST `/api/derm/cds/acne_severity`
- GET `/api/derm/cohorts/psoriasis_biologic`, `/melanoma`

## 4. DevOps
- RLS, encrypted dermatology images
- Audit every biopsy + pathology link

## 5. PM/UX
- Sub-tabs: General, Cosmetic, Surgery, Onc, Photo
- Layout F (imaging) for derm photos

## 6. Compliance
- CBAHI, AAD, Saudi Dermatology Society

## KPIs
1. Melanoma excised with margin ≥95%
2. Mohs for high-risk BCC ≥90%
3. Biologic for mod-severe psoriasis ≥70%
4. 5-year melanoma survival (localized) ≥95%
5. Phototherapy adherence ≥75%

## New files (this batch)
- Synthesis
