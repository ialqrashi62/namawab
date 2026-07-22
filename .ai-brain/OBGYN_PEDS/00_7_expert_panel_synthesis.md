# OBGYN & Pediatrics — Batch 3 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

---

## 1. OBGYN

### CMO
- **Mission:** OB + MFM + Gyn-surg + Repro Endo/IVF + Adolescent + Menopause + Urogyne
- **Top 5:** O80 (Delivery), O82 (C-section), N84.0 (Polyp), N92.6 (Irregular menses), N97.9 (Infertility)
- **Care bundles:** Pre-eclampsia, GDM, post-partum hemorrhage, neonatal resuscitation
- **Red flags:** Eclampsia, abruption, cord prolapse, ectopic, post-partum hemorrhage

### Sub-units
1. OB + Antenatal
2. Maternal-Fetal Medicine (MFM)
3. Prenatal Diagnosis (4D US, CVS, amnio)
4. Gyn Surgical (lap, robotic)
5. Reproductive Endocrinology & IVF
6. IVF Lab (ICSI, IMSI, PGD, Cryo bank)
7. Adolescent Gyn
8. Menopause Medicine
9. Urogynecology & Cosmetic Gyn

### AI Engineer
- RAG: ACOG, SMFM, ASRM, SOGC
- Engines: `partograph.js` (already exists in ob_engine), `ivf_stimulation.js`, `preeclampsia_risk.js`

### Architect
- API: POST `/api/obgyn/cds/partograph`, `/cds/ivf_stim`
- Tables: `pregnancies`, `deliveries`, `ivf_cycles`, `embryo_grades`

### DevOps
- RLS, encrypted
- Audit every delivery, every IVF cycle

### PM/UX
- Sub-tabs: OB, MFM, Prenatal Dx, Gyn Surg, Repro, IVF, Adolescent, Menopause, UroGyn
- Layout A + Layout E (timeline — gestational age)

### Compliance
- CBAHI, JCI, ACOG, ASRM, Saudi ObGyn Society
- IVF regulations (Saudi MoH, religious authorities)

### KPIs
1. C-section rate ≤25% (low-risk)
2. Maternal mortality 0
3. NICU admission rate ≤10% (term)
4. Preterm birth ≤8%
5. IVF live birth rate per cycle ≥25% (age <35)

---

## 2. Pediatrics (General + Sub-specialties)

### CMO
- **Mission:** General peds + neonatology + peds cardiology + peds nephro + peds GI + peds hem-onc + peds ophth + peds ENT + peds derm + peds endo + peds rheum + peds ortho + peds gen-surg
- **Top 5:** J45.909 (Asthma child), J18.9 (Pneumonia), A09 (GE), R50.9 (Fever), Z00.00 (Well-child)
- **Care bundles:** Vaccination schedule, growth monitoring, developmental screening
- **Red flags:** Sepsis in neonate, dehydration, meningitis, intussusception, Kawasaki

### Sub-units
1. General Pediatrics
2. Neonatology (NICU)
3. Pediatric Cardiology
4. Pediatric Nephrology
5. Pediatric GI
6. Pediatric Hem-Onc
7. Pediatric Ophth
8. Pediatric ENT
9. Pediatric Derm
10. Pediatric Endo
11. Pediatric Rheum
12. Pediatric Ortho
13. Pediatric General Surgery
14. Pediatric Genetics
15. Pediatric Nutrition
16. Developmental Pediatrics

### AI Engineer
- RAG: AAP, NICE peds, Saudi Pediatric Society
- Engines: `growth_percentile.js`, `vaccine_schedule.js`, `apgar_total` (already in clinical_calculators), `bilirubin_risk.js`

### Architect
- API: POST `/api/peds/cds/growth_percentile`, `/cds/vaccine`
- Tables: `peds_visits`, `growth_charts`, `vaccine_records`, `nicu_admissions`

### DevOps
- RLS, encrypted
- Audit every vaccination, every NICU event

### PM/UX
- Sub-tabs: General, NICU, Cardio, Nephro, GI, Hem-Onc, Ophth, ENT, Derm, Endo, Rheum, Ortho, Gen-Surg, Genetics, Nutrition, Developmental
- 3-col Layout A + Layout D (growth chart)

### Compliance
- CBAHI, JCI, AAP, Saudi Pediatric Society
- Mandatory vaccination per Saudi MoH

### KPIs
1. Vaccination coverage ≥95%
2. NICU mortality ≤10% (VLBW)
3. Well-child visit ≥90% (1y, 2y, 4y)
4. Breastfeeding initiation ≥80%
5. Developmental screening ≥90% (9m, 18m, 30m)
