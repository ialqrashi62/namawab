# Cardiology Benchmark — Epic vs Cerner vs MEDITECH vs Athena

## Top reference systems

| System | Module | Key features |
|---|---|---|
| **Epic** | EpicCare Cardiology | ECHO report, ECG, stress test, Cath lab documentation, structural heart procedures, LVAD, heart transplant, device implant (pacemaker/ICD/CRT) |
| **Cerner** | PowerChart Cardiovascular | Heart Failure module, Chest Pain pathway, ACS risk stratification, lipid protocol |
| **MEDITECH** | Expanse Cardiology | EKG ordering, ECHO, basic cath workflow |
| **Athena** | athenaOne Cardiology | Limited — mostly ambulatory cardiology referrals |

## Mandatory features (NamaMedical must ship)

### 1. Risk Stratification (Clinical Decision Support)
- [x] GRACE score (ACS in-hospital mortality) — **shipped** `cardiology_engine.js`
- [x] TIMI score (ACS 14-day mortality)
- [x] CHA2DS2-VASc (AF stroke risk) — **shipped**
- [x] HAS-BLED (bleeding risk on anticoagulation) — **shipped**
- [x] HEART score (chest pain in ED)
- [x] Wells DVT / PE
- [x] Seattle, Framingham, ASCVD
- [x] Killip class, NYHA FC

### 2. ECG Management
- [x] Order ECG (LOINC 11524-6)
- [x] Interpretation (STEMI detection, rate, rhythm, intervals) — **shipped** `detectStemi`
- [x] Serial comparison
- [ ] 12-lead, 15-lead, signal-averaged (Epic has all)
- [ ] Mobile ECG (KardiaMobile integration)

### 3. Echocardiogram
- [x] Order TTE/TEE
- [ ] Measurements (LVID, EF, valve areas, PASP)
- [ ] Severity grading (mild/mod/severe)
- [ ] Structured report with diagrams
- [ ] DICOM SR for measurement export

### 4. Cath Lab
- [x] Procedure order (CAG, PCI, CABG, TAVR, Mitraclip, Watchman) — **shipped**
- [x] Consent workflow
- [ ] Inventory (stents, balloons, drug-eluting)
- [ ] Live monitoring (actuarial ACT, heparin, contrast dose)
- [ ] Report with diagrams
- [ ] Door-to-balloon time KPI

### 5. Heart Failure Clinic
- [x] NYHA / ACC/AHA staging — **shipped** `classifyHeartFailure`
- [ ] Medication titration (GDMT: ACEi/ARB/ARNI, beta-blocker, MRA, SGLT2)
- [ ] Weight / BNP trend
- [ ] 30-day readmission risk

### 6. EP / Devices
- [ ] Pacemaker/ICD/CRT interrogation import
- [ ] Lead thresholds, battery longevity
- [ ] MRI conditionality

### 7. Cardiac Rehab
- [ ] Phase I-IV program tracking
- [ ] METs achieved

### 8. Structural Heart
- [ ] TAVR, Mitraclip, Watchman — **procedure codes shipped**
- [ ] Heart team workflow (CT surgeon + IC + cards + imaging)

### 9. Quality / Registries
- [ ] ACC NCDR (CathPCI, ICD, ACTION-GWTG)
- [ ] Saudi MoH cardiac registry
- [ ] STS score for CABG/valve

### 10. Integration
- [ ] HL7 FHIR Observation (ECG, ECHO) — `Observation` resource
- [ ] DICOM for cath/angio images
- [ ] NPHIES claim (Saudi mandatory)

## ICD-10 coverage (shipped in `cardiology_engine.CARDIOLOGY_ICD10`)

35 codes covering ACS (I21.0–I21.4), AF (I48.91/92), HF (I50.32/33), HTN
(I10/I11/I12/I13), valve disease, cardiomyopathy, DVT/PE, pericarditis,
endocarditis, devices (Z95.*).

## Gaps vs Epic / Cerner

| Epic feature | NamaMedical status | Plan |
|---|---|---|
| EpicCare Healthy Planet (population) | Not started | Q3-2026 |
| DICOM SR ECHO export | Not started | Wave 6 |
| HL7v2 ORU cath report | Wireframe only | Wave 7 |
| AI ECG interpretation (Apple Watch) | R&D | Phase C |

## Citation rules (per AGENTS.md)

Every score must carry:
- Original publication (PMID/DOI)
- Year
- Validation cohort
- Limitations

`cardiology_engine.js` already includes `cite` field on each result.

## Sources
- ACC/AHA guidelines 2023
- ESC guidelines 2021
- Saudi MoH Cardiac Care Standards (SFDA-aligned)
- NCDR CathPCI v5
