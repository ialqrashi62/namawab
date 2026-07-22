# Centers of Excellence — Batch 9 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

The 15 Centers of Excellence (CoE) are **unified dashboards** that aggregate
3-5 dept stations into a single coordination view. They do NOT replace the
underlying dept stations; they provide a center-level view for senior
leadership and care coordination.

---

## 1. Heart & Vascular Center
- **Aggregates:** cardiology + cardiothoracic + vascular
- **View:** Patient list across CV; door-to-balloon; CABG/TAVR volume; HF readmit
- **Lead:** Director of CV Services

## 2. Comprehensive Cancer Center
- **Aggregates:** medical onc + hem + BMT + rad-onc + pharmacy
- **View:** Tumor boards; clinical trials; chemo cycles; survivorship
- **Lead:** Cancer Center Director

## 3. Orthopedic & Spine Center
- **Aggregates:** ortho + neurosurgery-spine + rehab
- **View:** Arthroplasty queue; spine surgery outcomes; rehab progress
- **Lead:** Ortho Center Director

## 4. Advanced Fertility Center
- **Aggregates:** OB-GYN + IVF + andrology
- **View:** IVF cycles; success rate; cryo inventory; prenatal outcomes
- **Lead:** Reproductive Medicine Director

## 5. ENT & Head-Neck Center
- **Aggregates:** ENT + maxillofacial + sleep surgery
- **View:** H&N tumor board; cochlear implants; sleep studies
- **Lead:** ENT Center Director

## 6. Trauma Center
- **Aggregates:** ER + trauma surgery + ortho-trauma + neurosurgery-trauma
- **View:** Trauma activations; ISS scores; door-to-OR; mortality
- **Lead:** Trauma Director

## 7. Burn Center
- **Aggregates:** plastic + burn ICU + rehab
- **View:** TBSA admissions; Parkland compliance; graft outcomes
- **Lead:** Burn Director

## 8. Transplant Center
- **Aggregates:** nephro + CTS + gastro-hepato + BMT
- **View:** Waitlist; KDPI/EPTS; graft survival; immunosuppression
- **Lead:** Transplant Director

## 9. Geriatric Center
- **Aggregates:** internal med + rehab + psych
- **View:** Falls; polypharmacy; dementia; frailty score
- **Lead:** Geriatrician Lead

## 10. Pain Center
- **Aggregates:** anesthesia-pain + neurosurgery + rehab
- **View:** Chronic pain registry; opioid stewardship; SCS outcomes
- **Lead:** Pain Medicine Director

## 11. Bariatric & Metabolic Center
- **Aggregates:** endo + gastro + surgery-bariatric + nutrition
- **View:** Pre-op workup; post-op follow-up; weight loss; comorbidity resolution
- **Lead:** Bariatric Director

## 12. Children's Hospital (within Hospital)
- **Aggregates:** peds + NICU + PICU + all peds sub-specs
- **View:** Pediatric census; vaccination; growth monitoring; NICU outcomes
- **Lead:** Pediatrician-in-Chief

## 13. Behavioral Health Center
- **Aggregates:** psych + addiction + geri-psych
- **View:** Inpatient psych; outpatient visits; suicide risk; substance use
- **Lead:** Psychiatry Director

## 14. Eye Institute
- **Aggregates:** ophth + oculoplastics + peds-ophth
- **View:** Cataract volume; DR screening; glaucoma control; refractive outcomes
- **Lead:** Ophthalmologist-in-Chief

## 15. Neuroscience & Stroke Center
- **Aggregates:** neuro + neurosurgery + rehab + stroke unit
- **View:** Stroke activations (door-to-needle); mRS outcomes; DBS outcomes; rehab FIM gain
- **Lead:** Stroke Center Director

---

## Shared CoE Platform Features

- **Unified patient list** (across aggregated depts)
- **Tumor board / MDT scheduling** (for H&N, CV, Onc, etc.)
- **Quality dashboard** (each CoE has 5 KPIs)
- **Clinical trials** (one per CoE where applicable)
- **Research output** (publications per CoE)
- **Patient navigation** (single point-of-contact per CoE)
- **Marketing & GTM** (public-facing pages per CoE)
- **Outcome reporting** (CBAHI, JCI standards)

---

## KPIs (CoE-level)

- 30-day readmission rate
- 90-day outcome (procedure-specific)
- Patient satisfaction (≥4.5/5)
- Time to first treatment (cancer)
- Door-to-needle (stroke)
- Door-to-balloon (STEMI)
- 1-year survival (procedure-specific)

---

## Implementation

- **Phase 3.9:** Build the CoE dashboards as a `centers-station` in `namaweb/public/js/`
- **Data source:** Aggregated queries from existing dept tables (no new tables)
- **Auth:** Same `requireRole` + tenant scope + ACL for cross-dept view
- **Visualization:** Stitch Layout B (Dashboard) with KPI cards + patient list + timeline
