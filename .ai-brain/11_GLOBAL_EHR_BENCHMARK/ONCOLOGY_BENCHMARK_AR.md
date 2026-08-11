# Oncology Benchmark — Epic vs Cerner vs MEDITECH vs Athena + WHO SMART

## Top reference systems

| System | Module | Key features |
|---|---|---|
| **Epic** | Beacon (oncology) | Regimen library, chemotherapy ordering, toxicity grading (CTCAE), tumor board, NCCN guideline integration, survivorship plan |
| **Cerner** | Medical Oncology | Regimens, line-of-therapy tracking, biosimilars, clinical trials matching |
| **MEDITECH** | Meditech Oncology | Basic regimen, simple staging |
| **Athena** | (limited) | mostly referral management |

## Mandatory features

### 1. Staging
- [x] TNM (AJCC 8th edition) — **shipped** `oncology_engine.js`
- [ ] FIGO (gynecologic), Ann Arbor (lymphoma), ISS (myeloma), Rai (CLL)
- [ ] Breslow / Clark (melanoma)
- [ ] Gleason (prostate)
- [ ] WHO CNS grading

### 2. Regimen Library
- [ ] CHOP, ABVD, FOLFOX, R-CHOP, carboplatin/paclitaxel
- [ ] BSA calculation — **shipped**
- [ ] Chemo dose calculation — **shipped**
- [ ] Renal/hepatic dose adjustments
- [ ] Cumulative dose tracking (doxorubicin mg/m², bleomycin units)
- [ ] Prophylactic meds (antiemetic, G-CSF, hydration)

### 3. Toxicity Grading
- [ ] CTCAE v5.0 (Common Terminology Criteria for Adverse Events)
- [ ] Dose delays / reductions
- [ ] Mandatory lab checks (ANC >1500, plt >100k, Cr clearance)

### 4. Tumor Board
- [ ] Multidisciplinary conference scheduling
- [ ] Pathology, imaging, molecular results aggregation
- [ ] Treatment plan documentation

### 5. Survivorship
- [ ] Treatment summary
- [ ] Follow-up schedule (NCCN)
- [ ] Late-effects monitoring
- [ ] Care plan PDF export

### 6. Clinical Trials
- [ ] CTMS integration
- [ ] Eligibility matching (genomic + clinical)
- [ ] Consent (FDA Part 11 compliant e-signature)
- [ ] Adverse event reporting to sponsor

### 7. Genomics / Molecular
- [ ] NGS report ingestion
- [ ] Variant interpretation (ClinVar, CIViC)
- [ ] Therapy matching (OncoKB)

### 8. Palliative Care
- [ ] Symptom assessment (ESAS)
- [ ] Advance directives
- [ ] Hospice referral

### 9. Quality / Registries
- [ ] CoC (Commission on Cancer) — NCDB
- [ ] ASCO QOPI
- [ ] Saudi MoH cancer registry

### 10. ICD-10 Coverage (shipped)
- TNM-based C00–C97, D00–D09, Z85 personal/family history

## WHO SMART Guidelines alignment
- **Cervical cancer** (most mature SMART pack): HPV testing, VIA, treatment
- **Breast cancer**: screening + diagnosis workflow
- **Lymphoma**: staging + CHOP regimen
- **Leukemia**: ALL/AML/CML protocols

## Gaps vs Epic Beacon

| Epic feature | Status | Plan |
|---|---|---|
| NCCN guideline API | Not started | Wave 8 |
| Biosimilar substitution | Not started | Wave 7 |
| Survivorship Plan PDF | Not started | Wave 7 |
| Genomics matching | R&D | Phase B |

## Sources
- NCCN Guidelines 2024
- AJCC 8th edition staging manual
- CTCAE v5.0 (NIH)
- WHO SMART cervical cancer pack
- Saudi MoH Cancer Registry
