# Orthopedics — Batch 2 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

## 1. CMO

### Clinical Scope
- **Mission:** Trauma, sports, joint replacement, spine, hand/micro, foot/ankle, oncology, peds
- **Top 5:** M17.9 (Knee OA), M16.9 (Hip OA), S72.001A (Hip fracture), M54.5 (LBP), S82.101A (Tibia fracture)
- **Care bundles:** ERAS-ortho, VTE prophylaxis, SSI prevention, fall prevention
- **Red flags:** Compartment syndrome, DVT/PE, Cauda equina, septic arthritis, osteomyelitis

### Sub-units
1. General Ortho
2. Spine
3. Joint Replacement (Hip, Knee, Shoulder)
4. Trauma
5. Hand & Microsurgery
6. Foot & Ankle
7. Sports Medicine
8. Orthopedic Oncology
9. Pediatric Ortho

## 2. AI Engineer
- RAG: AAOS, OrthoGuidelines
- Engines: `vte_risk_engine.js` (Caprini), `joa_score.js` (Hip/Knee), `dfr_engine.js` (Distal Radius)

## 3. Architect
- API: POST `/api/ortho/cds/caprini`, `/cds/joa_preop`
- Tables: `ortho_cases`, `arthroplasty_details`, `spine_levels`, `trauma_classification`

## 4. DevOps
- RLS, encrypted OR notes
- Audit every case (implant tracking)

## 5. PM/UX
- Sub-tabs: General, Spine, Arthroplasty, Trauma, Hand, Foot, Sports, Onc, Peds
- 3-col Layout A + Layout D (X-ray/imaging)

## 6. Compliance
- CBAHI, JCI, AAOS, AO Foundation
- Implant registry (serial-number tracking)

## KPIs
1. ERAS-ortho compliance ≥75%
2. SSI rate ≤1% (arthroplasty)
3. DVT/PE rate ≤2% (arthroplasty)
4. 30-day readmit ≤5%
5. Op note within 24h ≥99%
