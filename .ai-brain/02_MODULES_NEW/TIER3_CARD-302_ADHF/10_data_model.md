# CARD-302_ADHF — Data Model

## Tables (5)

### 1. `hf_cases`
Core HF patient registry.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT NOT NULL | Multi-tenant |
| patient_id | INT NOT NULL | FK patient |
| ef_pct | INT | 0-100 |
| nyha_class | INT | 1-4 |
| acc_stage | VARCHAR(2) | A/B/C/D |
| nt_probnp | INT | pg/mL |
| bnp | INT | pg/mL |
| comorbidities | TEXT | |
| gdmt_score | INT | 0-4 (4 pillars) |
| intermacs | INT | 1-7 |
| scai_stage | VARCHAR(2) | A/B/C/D/E |
| on_transplant_list | BOOLEAN | |
| lvad_id | INT | FK |
| status | VARCHAR(20) | |
| assigned_cardiologist | INT | FK user |
| created_by | INT | FK user |
| created_at, updated_at | TIMESTAMPTZ | |

### 2. `hf_admissions`
Acute decompensation hospitalization records.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT | |
| hf_case_id | INT | FK |
| patient_id | INT | |
| admitted_at | TIMESTAMPTZ | |
| weight_kg | NUMERIC(5,2) | |
| weight_change_kg | NUMERIC(5,2) | |
| iv_diuretic | VARCHAR(50) | Furosemide/Bumetanide/Torsemide |
| dose_mg | NUMERIC(6,2) | |
| urine_output_ml_24h | INT | |
| discharge_weight | NUMERIC(5,2) | |
| discharge_date | DATE | |
| hospital_days | INT | |
| mortality_30d | BOOLEAN | |
| mortality_1yr | BOOLEAN | |
| readmitted_30d | BOOLEAN | |

### 3. `lvad_patients`
LVAD implant tracking.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT | |
| hf_case_id | INT | FK |
| patient_id | INT | |
| device | VARCHAR(50) | HeartMate 2/3, HVAD, Jarvik |
| implant_date | DATE | |
| indication | VARCHAR(50) | BTT/BTD/BTR |
| current_speed | INT | RPM |
| current_power | NUMERIC(4,2) | Watts |
| current_flow | NUMERIC(4,2) | L/min |
| map_target | INT | |
| inr_target | NUMERIC(3,1) | |
| complications | TEXT | |
| last_review_date | DATE | |
| last_review_by | INT | FK user |
| status | VARCHAR(20) | active/passed_away/transplanted |

### 4. `heart_transplants`
Transplant registry.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT | |
| hf_case_id | INT | FK |
| patient_id | INT | |
| transplant_date | DATE NOT NULL | |
| donor_id | INT | |
| donor_age | INT | |
| donor_cause | VARCHAR(100) | |
| ischaemia_time_min | INT | |
| immunosuppression_protocol | VARCHAR(100) | |
| induction_therapy | VARCHAR(100) | |
| first_biopsy_date | DATE | |
| rejection_episode_grade | VARCHAR(20) | 0/1R/2R/3R/AMR |
| cav_status | VARCHAR(20) | |
| status | VARCHAR(20) | active/deceased |

### 5. `hf_medications`
GDMT 4-pillar tracking + titration.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT | |
| hf_case_id | INT | FK |
| patient_id | INT | |
| drug_name | VARCHAR(100) | |
| pillar | VARCHAR(50) | arni/betablocker/mra/sglt2i/diuretic/anticoag |
| dose | VARCHAR(50) | |
| start_date | DATE | |
| end_date | DATE | |
| tolerated | BOOLEAN | |
| reason_discontinued | TEXT | |
| prescribed_by | INT | FK user |
| created_at | TIMESTAMPTZ | |

## RLS
All 5 tables: FORCE RLS + tenant_isolation policy.

## Indexes
- `hf_cases`: (tenant_id, patient_id), (ef_pct), (nyha_class)
- `hf_admissions`: (tenant_id, admitted_at DESC)
- `lvad_patients`: (tenant_id, implant_date)
- `heart_transplants`: (tenant_id, transplant_date DESC)
- `hf_medications`: (tenant_id, patient_id), (pillar)
