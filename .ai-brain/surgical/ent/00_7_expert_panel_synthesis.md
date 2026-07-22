# ENT — Batch 2 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

## 1. CMO

### Clinical Scope
- **Mission:** Head & neck, rhinology, otology, laryngology, thyroid (trans-cervical), sleep surgery
- **Top 5:** J32.9 (Chronic sinusitis), H66.90 (Otitis media), J35.01 (Tonsil hypertrophy), C32.9 (Larynx Ca), E04.9 (Goiter)
- **Care bundles:** Thyroid (calcium, RLN monitoring), otology (ABR pre-cochlear)
- **Red flags:** Peritonsillar abscess, sudden sensorineural HL, airway obstruction, neck mass with red flags

### Sub-units
1. General ENT
2. Head & Neck Surgical Oncology
3. Rhinology & Skull Base
4. Otology & Neurotology
5. Laryngology
6. Thyroid (cervical)
7. Sleep Surgery

## 2. AI Engineer
- RAG: AAO-HNS, Saudi ORL-HNS Society
- Engines: `snhl_workup.js`, `tinnitus_severity.js`

## 3. Architect
- API: POST `/api/ent/cds/snhl_workup`
- Tables: `ent_cases`, `audiograms`, `sinus_ct_findings`

## 4. DevOps
- RLS, encrypted op notes
- Audit every case (CPT, RLN monitoring)

## 5. PM/UX
- Sub-tabs: General, H&N, Rhino, Otology, Larynx, Thyroid, Sleep
- Layout A + Layout F (imaging — sinus CT, audiogram)

## 6. Compliance
- CBAHI, JCI, AAO-HNS

## KPIs
1. Sudden SNHL steroids ≤14d ≥90%
2. Cochlear implant rehab compliance ≥85%
3. RLN injury rate ≤1% (thyroid)
4. SSI rate ≤2%
5. Op note within 24h ≥99%
