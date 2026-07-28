<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — ICD-10 / SNOMED-CT / CPT / LOINC / RxNorm Map

## Top 10 Conditions

| # | Condition | ICD-10 | SNOMED-CT | Red flag |
|---|-----------|--------|-----------|----------|
| 1 | STEMI anterior | I21.0 | 401303003 | YES |
| 2 | STEMI inferior | I21.1 | 401304005 | YES |
| 3 | NSTEMI | I21.4 | 401305006 | YES (high-risk) |
| 4 | Unstable angina | I20.0 | 4557003 | YES |
| 5 | Cardiogenic shock | R57.0 | 89138009 | YES |
| 6 | Severe aortic stenosis | I35.0 | 60573004 | NO (syncope → YES) |
| 7 | Severe mitral regurgitation | I34.0 | 48724000 | NO |
| 8 | Atrial fibrillation | I48.91 | 49436004 | NO |
| 9 | HOCM | I42.1 | 195020009 | NO |
| 10 | Cardiac tamponade | I23.* | 195020009 | YES |

## Top 20 Procedures (CPT)

| # | Procedure | CPT | SNOMED-CT |
|---|-----------|-----|-----------|
| 1 | Diagnostic coronary angio | 93454 | 33367003 |
| 2 | PCI with stenting | 92928 | 415070008 |
| 3 | DES implant | 92928 + C9600 | 415070008 |
| 4 | FFR | 93571 | 386702001 |
| 5 | IVUS | 92978 | 252822005 |
| 6 | OCT | 92978 alt | 252822005 |
| 7 | Rotablation | 92996 | 415070008 |
| 8 | Orbital atherectomy | 92997 | 415070008 |
| 9 | Thrombus aspiration | 92973 | 426396005 |
| 10 | IABP | 33967 | 18275008 |
| 11 | Impella | 33990 | 18275008 |
| 12 | VA-ECMO | 33946 | 18275008 |
| 13 | TAVR | 33361-33365 | 725060001 |
| 14 | MitraClip | 33418-33419 | 725061002 |
| 15 | Watchman | 33340 | 725062009 |
| 16 | PFO closure | 93580 | 725063004 |
| 17 | ASD closure | 93580 alt | 725063004 |
| 18 | Alcohol septal ablation | 93583 | 425966005 |
| 19 | Endomyocardial biopsy | 93505 | 387731002 |
| 20 | Mechanical thrombectomy | 37195 | 426396005 |

## Key LOINC

| Test | LOINC |
|------|-------|
| Troponin I | 10839-9 |
| Troponin T | 6598-7 |
| BNP | 30934-4 |
| NT-proBNP | 33762-6 |
| Creatinine | 2160-0 |
| eGFR | 33914-3 |
| ACT | 3184-0 |
| HbA1c | 4548-4 |
| INR | 34714-6 |
| Cholesterol total | 2093-3 |
| LDL | 13457-7 |
| HDL | 2085-9 |
| Triglycerides | 2571-8 |

## Key RxNorm (High-Alert Drugs)

| Drug | RxNorm |
|------|--------|
| Heparin (UFH) | 5224 |
| Bivalirudin | 58927 |
| Enoxaparin | 67109 |
| Tirofiban | 10734 |
| Eptifibatide | 11149 |
| Aspirin | 1191 |
| Ticagrelor | 1116628 |
| Clopidogrel | 32968 |
| Prasugrel | 613391 |
| Warfarin | 11289 |
| Apixaban | 1364445 |
| Rivaroxaban | 1114198 |
| Dabigatran | 347810 |

---
*Section 22 of CARD-002. CMO voice. L1 DRAFT.*