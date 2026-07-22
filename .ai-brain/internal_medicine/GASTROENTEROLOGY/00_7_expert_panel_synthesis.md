# Gastroenterology — Batch 1 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22
> **Status:** A (existing brain) + new synthesis

## 1. CMO Input

### Clinical Scope
- **Mission:** GI + hepatobiliary + pancreatic care
- **Top 5 conditions:** K21.9 (GERD), K50.9 (Crohn's), K51.9 (UC), K70.30 (Alcoholic cirrhosis), K74.60 (Portal HTN)
- **Care bundles:** IBD bundle, variceal surveillance, cirrhosis decompensation
- **Red flags:** GI bleed, perforation, fulminant colitis, variceal hemorrhage, hepatic encephalopathy

### Sub-units
1. Advanced Endoscopy (EUS, ERCP, Enteroscopy)
2. Pancreato-Biliary
3. GI Motility
4. Hepatology
5. IBD Clinic

## 2. AI Engineer

### RAG Sources
- ACG, AGA, AASLD, Saudi Gastroenterology Society

### Engines
- `gi_bleed_risk_engine.js` (Glasgow-Blatchford)
- `ibd_activity_engine.js` (Mayo, CDAI)
- MELD, Child-Pugh (already exist)

## 3. Architect

### API
- POST `/api/gastro/cds/gbs` (GI bleed risk)
- POST `/api/gastro/cds/ibd_activity`
- GET `/api/gastro/cohorts/ibd`, `/cirrhosis`

## 4. DevOps
- RLS, PHI encrypted (endoscopy reports)
- Audit every procedure (CPT code)

## 5. PM/UX
- Sub-tabs: General, Endoscopy, Hepatology, IBD, Motility
- Layout F (imaging — endoscopy)

## 6. Compliance
- CBAHI APR, JCI IPSG
- 10-year retention for procedure notes

## KPIs
1. Bowel prep adequate ≥90%
2. ADR ≥25% in screening
3. HCV cure ≥95% with DAA
4. Cirrhosis surveillance (US+AFP q6m) ≥80%
5. 30-day readmit GI bleed ≤10%

## New files (this batch)
- Synthesis + i18n + budget skeletons
