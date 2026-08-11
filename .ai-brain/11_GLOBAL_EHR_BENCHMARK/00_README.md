# Global EHR Systems Benchmark — Per Department Reference

**Purpose:** When building NamaMedical, every module is benchmarked against the world's leading EHR/HIS systems so we never miss a feature, workflow, or clinical decision rule.

**Source-of-truth:** `.ai-brain/11_GLOBAL_EHR_BENCHMARK/{DEPT}_BENCHMARK_AR.md`

---

## Top 12 Systems Studied

| # | System | Vendor | Region | Specialty | Notes |
|---|---|---|---|---|---|
| 1 | **Epic** | Epic Systems (US) | Global | Tertiary care, IDN | Gold standard. Used by Mayo, Cleveland Clinic, Johns Hopkins |
| 2 | **Cerner / Oracle Health** | Oracle | Global | Enterprise hospitals | PowerChart, Millennium; FHIR-first |
| 3 | **MEDITECH** | Meditech (US) | Global | Community hospitals | Expanse; strong KSA footprint |
| 4 | **athenahealth** | Athena (US) | US | Ambulatory, network | athenaOne; cloud-native |
| 5 | **Allscripts / Altera** | Veradigm | US | Mixed | Sunrise; niche in specialties |
| 6 | **InterSystems TrakCare** | InterSystems | Global | National-scale | Strong in UK, KSA, NZ |
| 7 | **CPSI / Evident** | CPSI | US | Community/Critical access | Rural-friendly |
| 8 | **MEDITECH Expanse KSA** | Meditech + Alfaisaliah | KSA | MOH-aligned | Reference for NPHIES, PDPL |
| 9 | **EpicCare (KSA)** | King Faisal Specialist Hospital | KSA | Tertiary, oncology | Real Saudi deployment |
| 10 | **Naphirs** | Naphirs Healthcare | KSA | Mid-tier hospitals | Native Arabic, NPHIES |
| 11 | **Siha (MOH)** | Lean Business Services | KSA | National | Free, MOH-distributed |
| 12 | **WHO SMART Guidelines** | WHO | Global | All clinical | Open toolkit, decision support |

---

## Benchmark Coverage Matrix (44 Buckets × Top Systems)

For each department + cross-cutting module we map features against the **4 most influential** global systems:

| Bucket | Epic | Cerner | MEDITECH | Athena | Notes for NamaMedical |
|---|---|---|---|---|---|
| Patient Demographics | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | NPHIES, MRN, national-ID PK |
| Scheduling | ✓✓✓ | ✓✓ | ✓✓ | ✓✓✓ | Color-code, multi-resource |
| Orders / CPOE | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | Saudi MoH drug formulary |
| Pharmacy | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | SFDA, narcotics, IV-mix |
| Medication Administration (BCMA) | ✓✓✓ | ✓✓ | ✓✓ | ✓ | Bedside barcode |
| Clinical Documentation | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | Notes, flowsheets, narratives |
| Vitals / I&O | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | HL7 FHIR Observations |
| Nursing | ✓✓✓ | ✓✓ | ✓✓ | ✓ | Care plans, task lists |
| Problem List / Diagnoses | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | ICD-10-CM, ICD-10-PCS |
| Allergies | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | Critical interaction warnings |
| Results Review | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | Trend graphs, abnormal flag |
| Microbiology | ✓✓ | ✓✓ | ✓ | ✓ | Culture & sensitivity |
| Imaging / Radiology | ✓✓✓ | ✓✓✓ | ✓✓ | ✓ | DICOM SR, PACS integration |
| Cardiology | ✓✓✓ | ✓✓✓ | ✓✓ | ✓ | ECHO, ECG, Cath lab |
| Oncology | ✓✓✓ | ✓✓✓ | ✓✓ | ✗ | TNM, chemo regimen library |
| Surgery / OR | ✓✓✓ | ✓✓✓ | ✓✓ | ✗ | WHO Surgical Checklist |
| Anesthesia | ✓✓✓ | ✓✓ | ✓ | ✗ | ASA, BIS, MAC tracking |
| ICU / Critical Care | ✓✓✓ | ✓✓✓ | ✓✓ | ✗ | APACHE II/IV, SOFA, SAPS II |
| OB / Maternity | ✓✓✓ | ✓✓ | ✓✓ | ✓ | Partogram, APGAR |
| Pediatrics | ✓✓✓ | ✓✓ | ✓✓ | ✓ | Growth charts, immunization |
| ED / Emergency | ✓✓✓ | ✓✓ | ✓ | ✓ | ESI triage, trauma |
| Lab | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | LOINC, reflex testing |
| Blood Bank | ✓✓✓ | ✓✓ | ✓✓ | ✓ | ISBT-128, crossmatch |
| Dialysis | ✓✓ | ✓✓ | ✓ | ✗ | KT/V, URR |
| Dental | ✓ | ✓ | ✓ | ✓ | Odontogram |
| Dermatology | ✓✓ | ✓✓ | ✓ | ✓ | Photo, lesion tracking |
| Ophthalmology | ✓✓ | ✓✓ | ✓ | ✓ | Visual acuity, IOL |
| ENT | ✓ | ✓ | ✓ | ✓ | Audiometry |
| Rehab | ✓✓ | ✓✓ | ✓ | ✗ | FIM, Barthel |
| Psychiatry / Mental Health | ✓✓ | ✓✓ | ✓ | ✓ | PHQ-9, GAD-7, suicide risk |
| Infectious Disease | ✓✓ | ✓✓ | ✓ | ✗ | Outbreak detection |
| Quality / Safety | ✓✓✓ | ✓✓✓ | ✓✓ | ✓ | AHRQ PSI, never-events |
| Infection Control | ✓✓✓ | ✓✓ | ✓✓ | ✓ | NHSN, CAUTI/CLABSI |
| Risk Management | ✓✓ | ✓✓ | ✓ | ✓ | Incident reporting |
| Billing / Coding | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | CPT, ICD-10-PCS |
| Insurance / Claims | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | NPHIES, X12 837P |
| RCM / Denial Mgmt | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | ZATCA e-invoicing |
| Population Health | ✓✓✓ | ✓✓ | ✓ | ✓✓ | Risk stratification |
| Patient Portal | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | mynama = our equivalent |
| Telehealth | ✓✓ | ✓✓ | ✓ | ✓✓ | Native + third-party |
| Mobile Clinician | ✓✓✓ | ✓✓ | ✓ | ✓✓ | iOS + Android |
| Analytics / BI | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | Cube, Caboodle, Synapse |
| Data Warehouse | ✓✓✓ | ✓✓✓ | ✓✓ | ✓ | Snowflake, Databricks |
| AI / CDS | ✓✓✓ | ✓✓ | ✓ | ✓✓ | LLM agents (where we lead) |
| Genomics | ✓✓ | ✓ | ✗ | ✗ | Emerging |
| Clinical Trials | ✓✓ | ✓✓ | ✓ | ✗ | CTMS, EDC integration |
| Patient Engagement | ✓✓✓ | ✓✓ | ✓✓ | ✓✓ | SMS, push, kiosk |
| Research / IRB | ✓✓ | ✓✓ | ✓ | ✗ | Protocol management |
| Compliance / Audit | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | All systems; AGENTS.md RAIL-10 |
| SSO / MFA | ✓✓✓ | ✓✓✓ | ✓✓ | ✓✓ | SAML, OIDC, WebAuthn |
| Training / LMS | ✓✓ | ✓✓ | ✓ | ✓✓ | Clinical LMS |

✓✓✓ = primary differentiator; ✓✓ = strong; ✓ = present; ✗ = missing or weak

---

## Per-department detailed benchmark files

- `11_GLOBAL_EHR_BENCHMARK/CARDIOLOGY_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/ONCOLOGY_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/PEDIATRICS_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/SURGERY_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/PHARMACY_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/EMERGENCY_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/ENDOCRINE_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/PULMONOLOGY_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/GI_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/RHEUMATOLOGY_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/ORTHOPEDICS_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/NEUROLOGY_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/NEPHROLOGY_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/OBGYN_BENCHMARK_AR.md`

Plus cross-cutting:
- `11_GLOBAL_EHR_BENCHMARK/LAB_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/RADIOLOGY_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/BLOOD_BANK_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/ANESTHESIA_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/ICU_BENCHMARK_AR.md`
- `11_GLOBAL_EHR_BENCHMARK/DIALYSIS_BENCHMARK_AR.md`

---

## Use this benchmark

When the AUTOPILOT or a human agent generates a new department blueprint, the
generator MUST load the matching `*_BENCHMARK_AR.md` and ensure every ✓✓/✓✓✓
feature from Epic/Cerner/Meditech/Athena is either implemented or has an
explicit "out-of-scope" note. This guarantees we are never behind the global
standard.

This file is consumed by:
- `00-orchestrator/nm-engine-generator.py`
- `00-orchestrator/nm-dept-discovery.py`
- `03_AUTOPILOT/*.py`
