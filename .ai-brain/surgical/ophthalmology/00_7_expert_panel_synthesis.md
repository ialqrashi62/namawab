# Ophthalmology — Batch 2 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

## 1. CMO

### Clinical Scope
- **Mission:** Vitreoretinal, cornea, cataract, glaucoma, oculoplastics, peds, neuro-ophth, refractive
- **Top 5:** H25.9 (Cataract), H40.9 (Glaucoma), H35.30 (AMD), H33.20 (Retinal detachment), H16.9 (Keratitis)
- **Care bundles:** Diabetic retinopathy screening, post-op drops compliance
- **Red flags:** Acute angle-closure glaucoma, retinal detachment, endophthalmitis, sudden vision loss

### Sub-units
1. General Ophth
2. Vitreoretinal
3. Cornea + Eye Bank
4. Cataract + Anterior Segment
5. Glaucoma
6. Oculoplastics & Orbit
7. Pediatric Ophth + Strabismus
8. Neuro-ophthalmology
9. Refractive Surgery

## 2. AI Engineer
- RAG: AAO, Saudi Ophth Society
- Engines: `iop_target.js`, `dr_severity.js`, `amd_classify.js`

## 3. Architect
- API: POST `/api/ophth/cds/iop_target`, `/cds/dr_severity`
- Tables: `ophth_cases`, `oct_scans`, `visual_fields`

## 4. DevOps
- RLS, encrypted imaging
- Audit every procedure (CPT, IOL serial)

## 5. PM/UX
- Sub-tabs: General, VR, Cornea, Cataract, Glaucoma, Oculoplastics, Peds, Neuro, Refractive
- Layout F (imaging — OCT, fundus photo, visual field)

## 6. Compliance
- CBAHI, JCI, AAO
- Eye Bank regulations (FDA-equivalent)

## KPIs
1. DR screening ≥90% diabetics
2. Endophthalmitis rate ≤0.05% (cataract)
3. IOP target achieved ≥80% (glaucoma)
4. Post-op visual acuity ≥20/40 ≥95% (cataract)
5. Op note within 24h ≥99%
