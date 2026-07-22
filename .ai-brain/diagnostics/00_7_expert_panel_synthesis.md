# Diagnostics — Batch 4 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

---

## 1. Radiology

### CMO
- **Mission:** Diagnostic + Interventional + CT + MRI + US + Nuclear Medicine
- **Top 5:** Stroke (CT angio), PE (CTPA), Trauma (pan-scan), Tumor staging, Cardiac CT
- **Care bundles:** Lung cancer screening, breast screening
- **Red flags:** Tension pneumothorax, dissection, PE, cord compression, perforation

### Sub-units
1. Diagnostic Radiology
2. Interventional Radiology (angio, embolization, ablation, stenting)
3. CT (dual-energy, cardiac, peripheral)
4. MRI (fMRI, MR-spect, DTI, MRA, breast, pelvis)
5. Ultrasound (TEE, TRUS, 4D, Doppler)
6. Nuclear Medicine (PET-CT, bone scan, thyroid, renal, MPI)
7. Radioisotope Therapy (I-131, etc.)

### AI Engineer
- RAG: ACR, RSNA, ARRS
- Engines: `lung_rads.js`, `bi_rads.js` (breast), `ti_rads.js` (thyroid), `pi_rads.js` (prostate)

### KPIs
1. Critical result turnaround ≤30 min
2. Report turnaround ≤24h (routine), ≤1h (stat)
3. Lung-RADS compliance ≥90%
4. Stroke door-to-needle ≤60 min
5. 30-day readmit post-IR ≤5%

---

## 2. Laboratory

### CMO
- **Mission:** Pathology + Microbiology + Chemistry + Immunology + Genetics + Toxicology + Blood Bank
- **Top 5:** Anemia workup, sepsis workup, coagulopathy, hepatitis screen, tumor markers
- **Care bundles:** Sepsis lactate, blood culture, G6PD, thalassemia screen
- **Red flags:** Critical hyperkalemia (>6.5), glucose <40, hemoglobin <7, platelets <20

### Sub-units
1. Histopathology
2. Cytopathology
3. Frozen Section
4. EM + IHC + Molecular Path
5. Bacteriology, Virology, Mycology, Parasitology
6. Clinical Chemistry
7. Immunology & Serology
8. Medical Genetics
9. Toxicology
10. Blood Bank

### AI Engineer
- Engines: `critical_value_alert.js` (already in pathology_engine), `culture_id_engine.js`

### KPIs
1. Critical value callback ≤30 min
2. TAT: ED troponin ≤1h
3. TAT: CBC ≤30 min
4. TAT: surgical pathology ≤3d
5. Blood product wastage ≤2%

---

## 3. Functional Diagnostics

### CMO
- **Mission:** ECG, Holter, Stress, Angio, EMG, EEG, PFT, Allergy
- **Top 5:** Abnormal ECG, sleep study, PFT, EEG for seizure, EMG for neuropathy
- **Red flags:** STEMI, SVT, VT, status epilepticus, severe asthma

### Sub-units
1. ECG & Stress (exercise, dobutamine, Holter, event)
2. Cerebral Angiography
3. EMG & Nerve Conduction (with EP)
4. EEG (with Video-EEG)
5. PFT (with exercise, DLCO)
6. Allergy Testing

### AI Engineer
- Engines: `ecg_interpret.js` (AI-assist), `pft_interpret.js`

### KPIs
1. ECG TAT ≤15 min
2. Holter analysis ≤24h
3. PFT TAT ≤30 min
4. EEG urgent read ≤2h
5. Critical ECG callback ≤5 min
