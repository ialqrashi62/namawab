# Plastic & Burns — Batch 2 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

## 1. CMO

### Clinical Scope
- **Mission:** Reconstructive, cosmetic, microsurgery, burn care, maxillofacial
- **Top 5:** T30.0 (Burn), Q17.9 (Ear anomaly), N62 (Breast hypertrophy), C50.9 (Breast Ca reconstruction), S09.93XA (Facial trauma)
- **Care bundles:** Burn resuscitation (Parkland), early excision & grafting
- **Red flags:** Inhalational injury, burn shock, compartment syndrome, sepsis

### Sub-units
1. Plastic & Reconstructive
2. Facial Plastic
3. Body Contouring
4. Microsurgery
5. Composite Tissue Allotransplantation
6. Burns Center
7. Maxillofacial

## 2. AI Engineer
- RAG: ASPS, ISBI, ABA
- Engines: `tbsa_rule_of_nines` (already in clinical_calculators), `parkland_formula` (already in clinical_calculators), `burn_resuscitation.js`

## 3. Architect
- API: POST `/api/plastic/cds/burn_fluid_calc` (uses /api/calculators/parkland)
- Tables: `plastic_cases`, `burn_resuscitations`, `graft_details`

## 4. DevOps
- RLS, encrypted op notes, encrypted burn photos
- Audit every case (TBSA %, burn depth)

## 5. PM/UX
- Sub-tabs: Reconstruct, Facial, Body, Micro, Burns, Maxillofacial
- Layout A + Layout F (photos — pre/post)

## 6. Compliance
- CBAHI, JCI, ABA, ASPS
- Burn registry submission

## KPIs
1. Burn survival ≥95% (TBSA <40%)
2. Graft take rate ≥90%
3. Microsurgical flap success ≥95%
4. Op note within 24h ≥99%
5. 30-day readmit ≤5%
