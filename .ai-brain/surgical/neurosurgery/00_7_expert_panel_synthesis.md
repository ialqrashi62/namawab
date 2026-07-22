# Neurosurgery — Batch 2 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

## 1. CMO

### Clinical Scope
- **Mission:** Cerebrovascular, neuro-onc, functional, peripheral nerve, skull base, endoscopic neuro, spine
- **Top 5:** I63.9 (Stroke), C71.9 (Brain tumor), S06.9 (TBI), M48.0 (Spinal stenosis), G40.9 (Epilepsy)
- **Care bundles:** Stroke pathway, TBI bundle, post-op monitoring
- **Red flags:** Increased ICP, herniation, cord compression, aneurysm re-rupture

### Sub-units
1. Cerebrovascular (aneurysm, AVM)
2. Neuro-oncology
3. Functional (DBS, epilepsy)
4. Peripheral nerve
5. Skull base
6. Endoscopic neuro (transsphenoidal)
7. Spine (interventional, scoliosis)

## 2. AI Engineer
- RAG: AANS, CNS, AHA/ASA
- Engines: `nihss_engine.js` (NIH Stroke Scale — already exists), `mrs_engine.js` (Modified Rankin)

## 3. Architect
- API: POST `/api/neuro/cds/nihss`, `/cds/mrs`
- Tables: `neurosurgical_cases`, `avm_details`, `spine_levels`

## 4. DevOps
- RLS, encrypted OR notes
- Audit every case (NIH Stroke Scale, mRS at discharge)

## 5. PM/UX
- Sub-tabs: Cerebrovasc, Neuro-Onc, Functional, Peripheral, Skull Base, Endo, Spine
- 3-col Layout A + Layout D (NIHSS trend)

## 6. Compliance
- CBAHI, JCI, Stroke Center certification

## KPIs
1. Stroke door-to-needle ≤60 min
2. mRS 0-2 at 90d ≥50% (ischemic stroke)
3. Aneurysm re-rupture <2%
4. 30-day readmit ≤10%
5. Op note within 24h ≥99%
