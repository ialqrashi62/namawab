# General Surgery — Batch 2 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

## 1. CMO

### Clinical Scope
- **Mission:** General surgery + oncologic + bariatric + breast + trauma + colorectal + endocrine + robotic
- **Top 5:** K35.80 (Appendicitis), K40.90 (Inguinal hernia), K80.20 (Gallstone), C18.9 (Colon Ca), K56.60 (SBO)
- **Care bundles:** ERAS protocol, VTE prophylaxis, SSI prevention
- **Red flags:** Perforation, peritonitis, sepsis, mesenteric ischemia, AAA rupture

### Sub-units (8)
1. Robotic / Minimal Invasive
2. Bariatric
3. Breast
4. Trauma
5. Colorectal
6. Endocrine (Thyroid, Adrenal, Parathyroid)
7. Surgical Oncology
8. General MIS

## 2. AI Engineer
- RAG: ACS, SAGES, ASCO, Saudi Surgical Society
- Engines: `eras_engine.js`, `ssi_risk_engine.js` (NNIS, ACS NSQIP), `vte_risk_engine.js` (Caprini)

## 3. Architect
- API: POST `/api/surgery/cds/eras_eligible`, `/cds/ssi_risk`, `/cds/vte_risk`
- New tables: `surgical_cases`, `perioperative_notes`, `surgical_site_infections`

## 4. DevOps
- RLS, encrypted operative notes
- Audit every case (CPT code, ASA class, wound class)

## 5. PM/UX
- Sub-tabs: Robotic, Bariatric, Breast, Trauma, Colorectal, Endo, Onc, General
- 3-col Layout A (general) + Layout G (op notes form)

## 6. Compliance
- CBAHI, JCI, ACS NSQIP
- Universal Protocol (surgical timeout, site marking)

## KPIs
1. ERAS protocol compliance ≥80%
2. SSI rate ≤2% (clean), ≤5% (clean-contaminated)
3. 30-day readmit ≤5%
4. VTE prophylaxis ≥98%
5. Op note within 24h ≥99%

## New files (this batch)
- Synthesis
