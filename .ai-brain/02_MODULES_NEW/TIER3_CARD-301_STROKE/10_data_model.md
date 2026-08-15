# CARD-301_STROKE — Data Model

## Tables (5)

### 1. `stroke_cases`
Comprehensive stroke center case tracking.

| Column | Type | Description |
|---|---|---|
| id | SERIAL PK |  |
| tenant_id | INT NOT NULL | Multi-tenant |
| patient_id | INT NOT NULL | FK patient |
| encounter_id | INT | FK encounter |
| stroke_type | VARCHAR(50) | AIS / ICH / SAH / TIA / CVST |
| arrival_time | TIMESTAMPTZ | Door time |
| last_known_well | TIMESTAMPTZ | TLKW critical for thrombolysis window |
| nihss_score | INT | 0-42 |
| ct_findings | VARCHAR(100) | enum |
| aspects_score | INT | 0-10 |
| code_stroke_activated | BOOLEAN | |
| admitted_to_stroke_unit | BOOLEAN | |
| status | VARCHAR(20) | active / discharged / transferred / deceased |
| assigned_neurologist | INT | FK user |
| created_by | INT | FK user |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### 2. `stroke_thrombolysis`
IV thrombolysis treatments.

| Column | Type | Description |
|---|---|---|
| id | SERIAL PK |  |
| tenant_id | INT | |
| stroke_case_id | INT | FK stroke_cases |
| patient_id | INT NOT NULL | FK patient |
| agent | VARCHAR(50) | tenecteplase / alteplase |
| dose_mg | NUMERIC(5,2) |  |
| weight_kg | NUMERIC(5,2) |  |
| administered_at | TIMESTAMPTZ |  |
| door_to_needle_minutes | INT | Target ≤60 |
| nihss_before | INT |  |
| nihss_after_24h | INT |  |
| complications | TEXT |  |
| consent_obtained | BOOLEAN | PDPL |
| consent_witness | VARCHAR(100) |  |
| ordering_physician | INT | FK user |
| created_at | TIMESTAMPTZ |  |

### 3. `stroke_thrombectomy`
Mechanical thrombectomy (LVO).

| Column | Type | Description |
|---|---|---|
| id | SERIAL PK |  |
| tenant_id | INT |  |
| stroke_case_id | INT | FK stroke_cases |
| patient_id | INT | FK patient |
| procedure_time | TIMESTAMPTZ |  |
| door_to_groin_minutes | INT | Target ≤90 |
| tici_score | INT | 0-3 (reperfusion) |
| groin_puncture_time | TIMESTAMPTZ |  |
| reperfusion_time | TIMESTAMPTZ |  |
| mrs_24h | INT | 0-6 |
| mrs_7d | INT | 0-6 |
| mrs_30d | INT | 0-6 |
| complications | TEXT |  |
| operator | VARCHAR(100) | Interventional neuroradiologist |
| created_at | TIMESTAMPTZ |  |

### 4. `stroke_imaging`
CT/CTA/MRI/CTP imaging studies.

| Column | Type | Description |
|---|---|---|
| id | SERIAL PK |  |
| tenant_id | INT |  |
| stroke_case_id | INT | FK stroke_cases |
| patient_id | INT | FK patient |
| imaging_type | VARCHAR(50) | CT / CTA / MRI / CTP / MRA |
| performed_at | TIMESTAMPTZ |  |
| findings | TEXT |  |
| aspects_score | INT | 0-10 |
| occlusion_site | VARCHAR(50) | ICA / M1 / M2 / Basilar / PCA |
| perfusion_findings | TEXT |  |
| radiologist | VARCHAR(100) |  |
| created_at | TIMESTAMPTZ |  |

### 5. `stroke_followup`
30-day outcome tracking.

| Column | Type | Description |
|---|---|---|
| id | SERIAL PK |  |
| tenant_id | INT |  |
| stroke_case_id | INT | FK |
| patient_id | INT |  |
| followup_date | DATE |  |
| mrs_score | INT | 0-6 |
| medication_adherent | BOOLEAN |  |
| bp_at_goal | BOOLEAN |  |
| recurrent_event | BOOLEAN |  |
| rehab_status | VARCHAR(50) |  |
| notes | TEXT |  |
| created_at | TIMESTAMPTZ |  |

## RLS Policies
All 5 tables: FORCE RLS + tenant_isolation policy.

## Indexes
- `idx_stroke_cases_tenant_patient`
- `idx_stroke_cases_arrival` (DESC)
- `idx_stroke_thrombolysis_admin` (DESC)
- `idx_stroke_thrombolysis_dnt` (for SLA tracking)
- `idx_stroke_thrombectomy_tici`
- `idx_stroke_imaging_patient`
- `idx_stroke_followup_date` (DESC)
