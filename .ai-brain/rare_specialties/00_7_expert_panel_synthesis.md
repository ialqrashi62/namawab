# Rare & Super-Specialized — Batch 10 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

The 12 Rare & Super-Specialized departments are deep sub-specialties that
require dedicated research-grade expertise, specialized equipment, and
often partnership with academic medical centers. They are typically
referral-only services with small patient volumes but high complexity.

---

## 1. Space & Dive Medicine
- **Indications:** Commercial diving, aviation emergencies, microgravity effects
- **Engine:** `space_medicine.js` (barotrauma, decompression, O2 toxicity)
- **Volume:** <50 cases/year

## 2. Sleep Disorders Center (Polysomnography)
- **Indications:** OSA, narcolepsy, parasomnias, circadian disorders
- **Engine:** `sleep_study_engine.js` (AHI, ODI, sleep staging)
- **Volume:** 500-1000 studies/year
- **Link to:** Pulmonology, Neurology

## 3. Epilepsy Monitoring Unit
- **Indications:** Drug-resistant epilepsy, pre-surgical eval, seizure classification
- **Engine:** `epilepsy_em.js` (seizure frequency, video-EEG interpretation)
- **Volume:** 50-100 admissions/year
- **Link to:** Neurology, Neurosurgery (functional)

## 4. Advanced Stem Cell Therapy
- **Indications:** Hematologic malignancy (BMT), regenerative medicine (research)
- **Engine:** `stem_cell.js` (cell count, viability, engraftment)
- **Volume:** <20 cases/year
- **Link to:** Hematology, BMT, Research

## 5. Fetal Surgery
- **Indications:** Spina bifida, twin-twin transfusion, congenital diaphragmatic hernia, urinary tract obstruction
- **Engine:** `fetal_surgery.js` (CTG, biophysical profile, Doppler)
- **Volume:** <10 cases/year
- **Link to:** MFM, Pediatric Surgery, NICU

## 6. Fetal Medicine Unit
- **Indications:** High-risk pregnancy, fetal anomalies, genetic dx
- **Engine:** `fetal_medicine.js` (CTG, biophysical profile, Doppler)
- **Volume:** 200-400 visits/year
- **Link to:** MFM, OB, Genetics

## 7. Deep Brain Stimulation (DBS)
- **Indications:** Parkinson disease, essential tremor, dystonia, OCD
- **Engine:** Extension to `neurosurgery_engine`
- **Volume:** 20-50 implants/year
- **Link to:** Neurology, Neurosurgery (functional)

## 8. Nuclear Medicine Therapy
- **Indications:** Thyroid Ca (I-131), neuroendocrine tumors (Lu-177), radiosynovectomy
- **Engine:** Extension to `lis.js` (dosimetry, dose calibration)
- **Volume:** 100-300 treatments/year
- **Link to:** Nuclear Medicine, Endocrinology, Oncology

## 9. Cryotherapy / Cryosurgery
- **Indications:** Skin lesions, prostate, liver, cervical, bone
- **Engine:** `cryo_unit.js` (freeze-thaw cycles, ice-ball monitoring)
- **Volume:** 100-200/year
- **Link to:** Dermatology, Urology, Oncology

## 10. Confocal Laser Endomicroscopy (CLE)
- **Indications:** Real-time histology during endoscopy (Barrett, IBD, pancreatic cysts)
- **Engine:** `endomicro_engine.js` (image classification)
- **Volume:** <100/year
- **Link to:** Gastroenterology, Pulmonology

## 11. Pharmacogenomics
- **Indications:** Drug-gene interactions, dosing optimization
- **Engine:** `pharmacogenomics.js` (CPIC, DPWG guidelines)
- **Volume:** 100-500 consults/year
- **Link to:** Pharmacy, Oncology, Psychiatry

## 12. Nanomedicine & Microrobotics
- **Indications:** Research; targeted drug delivery (cancer, CNS)
- **Engine:** `nanomedicine_engine.js` (research only)
- **Volume:** Research only
- **Link to:** Research, Oncology

---

## Common Standards

- **Patient volume:** Low (referral-only)
- **Equipment cost:** High
- **Expertise:** Subspecialty fellowship + research experience
- **Compliance:** IRB approval, Saudi MoH specialized license
- **Partnership:** Often with academic medical centers (KFSH, KSU, etc.)
- **Documentation:** Research-grade; publishable case series
- **Cost:** High per case; covered by MoH for Saudi nationals
- **Outcomes:** Tracked via disease-specific registry
- **Research output:** Expected (1-2 publications/year per dept)

---

## Implementation Priority

- **P1:** Sleep Disorders, Fetal Medicine, Pharmacogenomics
- **P2:** Epilepsy EM, Fetal Surgery, Nuclear Therapy, Cryo
- **P3:** Space, Stem Cell, DBS, CLE, Nano (research)

---

## Engines (new)

- `space_medicine.js`
- `sleep_study.js` (consolidated with Pulmonology)
- `epilepsy_em.js`
- `stem_cell.js`
- `fetal_surgery.js`
- `fetal_medicine.js`
- `cryo_unit.js`
- `endomicro_engine.js`
- `pharmacogenomics.js`
- `nanomedicine_engine.js`

Plus extensions to `neurosurgery_engine` (DBS) and `lis.js` (nuclear therapy).

---

## KPIs (CoE-level)

- **Procedure success rate** (per rare procedure)
- **30-day / 90-day outcome** (procedure-specific)
- **Patient satisfaction** (≥4.5/5)
- **Research output** (≥1 publication/year)
- **Registry submission** (≥90% cases)
