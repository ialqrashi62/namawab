# Generation Report — generate_blueprint_v2.py

**Generated:** 2026-07-23T21:44:10.571179+00:00
**Departments:** 38 (DEP-001..DEP-038)
**Files written:** 76 (38 up + 38 down)
**Errors:** 0
**Schema:** blueprint_v2 (shared; do NOT drop during down migrations)

## Per-department summary

| Dept | Name (EN) | Main Table | Up lines | Down lines |
|------|-----------|------------|----------|------------|
| DEP-001 | Emergency Department | `ed_encounter` | 89 | 35 |
| DEP-002 | Adult Intensive Care Unit (ICU) | `icu_admission` | 86 | 35 |
| DEP-003 | Coronary Care Unit (CCU) | `ccu_admission` | 84 | 35 |
| DEP-004 | Neonatal Intensive Care Unit (NICU) | `nicu_admission` | 85 | 35 |
| DEP-005 | Pediatric Intensive Care Unit (PICU) | `picu_admission` | 84 | 35 |
| DEP-006 | Burn Unit | `burn_assessment` | 84 | 35 |
| DEP-007 | Cardiology | `cardiology_consult` | 85 | 35 |
| DEP-008 | Pulmonology | `pulmonary_function_test` | 84 | 35 |
| DEP-009 | Gastroenterology | `gi_endoscopy` | 84 | 35 |
| DEP-010 | Nephrology & Dialysis | `dialysis_session` | 85 | 35 |
| DEP-011 | Endocrinology & Diabetes | `endocrine_visit` | 83 | 35 |
| DEP-012 | Hematology | `hematology_panel` | 84 | 35 |
| DEP-013 | Oncology & Medical Oncology | `oncology_treatment_plan` | 84 | 35 |
| DEP-014 | Rheumatology | `rheum_assessment` | 83 | 35 |
| DEP-015 | Infectious Diseases | `id_consult` | 83 | 35 |
| DEP-016 | Dermatology | `derm_lesion_record` | 83 | 35 |
| DEP-017 | Neurology | `neuro_exam` | 82 | 35 |
| DEP-018 | Psychiatry & Mental Health | `psych_assessment` | 83 | 35 |
| DEP-019 | General Surgery | `surgical_case` | 85 | 35 |
| DEP-020 | Orthopedics & Trauma | `ortho_fracture` | 83 | 35 |
| DEP-021 | Neurosurgery | `neurosurg_case` | 83 | 35 |
| DEP-022 | Cardiothoracic Surgery | `cts_case` | 83 | 35 |
| DEP-023 | Vascular Surgery | `vascular_case` | 82 | 35 |
| DEP-024 | Urology | `urology_procedure` | 82 | 35 |
| DEP-025 | Otorhinolaryngology (ENT) | `ent_exam` | 82 | 35 |
| DEP-026 | Ophthalmology | `ophth_exam` | 84 | 35 |
| DEP-027 | Plastic & Reconstructive Surgery | `plastic_surgery_case` | 82 | 35 |
| DEP-028 | Anesthesiology & Pain Management | `anesthesia_record` | 83 | 35 |
| DEP-029 | Obstetrics & Gynecology (OB/GYN) | `obgyn_visit` | 84 | 35 |
| DEP-030 | Pediatrics & General | `peds_visit` | 85 | 35 |
| DEP-031 | Reproductive Medicine & IVF | `ivf_cycle` | 84 | 35 |
| DEP-032 | Well-Baby & Lactation Clinic | `well_baby_visit` | 82 | 35 |
| DEP-033 | Radiology & Medical Imaging | `imaging_study` | 85 | 35 |
| DEP-034 | Laboratory & Pathology | `lab_result` | 90 | 35 |
| DEP-035 | Pharmacy & Therapeutics | `medication_dispense` | 88 | 35 |
| DEP-036 | Physiotherapy & Rehabilitation | `rehab_session` | 83 | 35 |
| DEP-037 | Central Sterile Services Department (CSSD) | `cssd_sterilization_cycle` | 85 | 35 |
| DEP-038 | Health Information Management (HIM) / Medical Records | `medical_record_request` | 85 | 35 |

## Errors

None.

## Safety-rail verification (per AGENTS.md §2.2)

- [x] No hardcoded secrets, keys, or tokens in any generated file
- [x] No PHI; only schema definitions (column types + constraints)
- [x] Every table has `tenant_id` + ENABLE/FORCE ROW LEVEL SECURITY
- [x] Every table has `created_at_utc`, `updated_at_utc`, `deleted_at_utc`
- [x] PHI-flagged columns have `-- PHI-ENVELOPE` marker for crypto_envelope.js
- [x] Down migrations DROP only objects the up migration created
- [x] Down migrations do NOT DROP data outside the dept table
- [x] Generated files contain the 'BLUEPRINT v2 — INFORMATIONAL' banner
