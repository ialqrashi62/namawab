# Rheumatology — Batch 1 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

## 1. CMO Input

### Clinical Scope
- **Mission:** Rheumatic + autoimmune + allergic disease
- **Top 5:** M06.9 (RA), M32.9 (SLE), M35.00 (Sjögren), M31.30 (Vasculitis), M45.9 (Ankylosing spondylitis)
- **Care bundles:** RA treat-to-target, lupus nephritis, GCA emergency
- **Red flags:** Vasculitis emergency, lupus nephritis, ILD, macrophage activation

### Sub-units
1. RA clinic
2. Lupus / Connective tissue
3. Vasculitis
4. Spondyloarthritis
5. Allergy & Asthma (joint)
6. Immunology

## 2. AI Engineer

### Engines
- `disease_activity_engine.js` (DAS28 for RA, SLEDAI for lupus)
- `vasculitis_severity_engine.js` (BVAS, FFS)
- `biologic_engine.js` (drug selection, infection risk)

## 3. Architect

### API
- POST `/api/rheuma/cds/das28`
- POST `/api/rheuma/cds/sledai`
- POST `/api/rheuma/cds/bvas`
- GET `/api/rheuma/cohorts/ra`, `/sle`

## 4. DevOps
- RLS, encrypted joint counts, biologics tracking
- Audit every biologic start/stop

## 5. PM/UX
- Sub-tabs: RA, SLE, Vasculitis, SpA, Allergy
- Layout D for DAS28/SLEDAI trends

## 6. Compliance
- CBAHI, ACR/EULAR

## KPIs
1. T2T achieved ≥70% RA
2. Biologic initiation ≤6m for refractory RA ≥50%
3. Bone density screen ≥80% chronic steroids
4. Vaccination ≥80% immunosuppressed
5. 1-year survival AAV ≥85%

## New files (this batch)
- Synthesis
