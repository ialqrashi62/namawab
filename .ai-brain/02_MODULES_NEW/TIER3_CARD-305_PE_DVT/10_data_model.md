# CARD-305_PE_DVT — Data Model

## Tables (3)

### 1. `pe_dvt_cases`
PE/DVT case registry.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT NOT NULL | |
| patient_id | INT NOT NULL | FK patient |
| diagnosis | VARCHAR(50) | PE_proximal/PE_segmental/DVT_proximal/DVT_distal |
| severity | VARCHAR(20) | massive/intermediate_high/intermediate_low/low |
| location | VARCHAR(100) | saddle/RPA/LPA/IVC/femoral/popliteal |
| sbp | INT | |
| hr | INT | |
| spo2 | INT | |
| rv_dysfunction | BOOLEAN | |
| biomarker_positive | BOOLEAN | troponin/BNP |
| pert_activated | BOOLEAN | |
| status | VARCHAR(20) | active/discharged/deceased |
| created_by | INT | FK user |
| created_at, updated_at | TIMESTAMPTZ | |

### 2. `pe_dvt_treatments`
Treatment records.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT | |
| case_id | INT | FK |
| patient_id | INT | |
| treatment_type | VARCHAR(50) | systemic_thrombolysis/cdt/thrombectomy/ivc_filter/anticoagulation |
| drug_name | VARCHAR(50) | Alteplase/Tenecteplase/Apixaban/etc. |
| dose_mg | NUMERIC(6,2) | |
| started_at | TIMESTAMPTZ | |
| completed_at | TIMESTAMPTZ | |
| complications | TEXT | |
| success | BOOLEAN | |
| created_at | TIMESTAMPTZ | |

### 3. `pe_dvt_followups`
Post-PE surveillance (CTEPH screening).

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT | |
| case_id | INT | FK |
| patient_id | INT | |
| followup_date | DATE | |
| followup_type | VARCHAR(50) | 3-month/6-month/1-year/cteph_workup |
| echo_findings | TEXT | |
| ct_findings | TEXT | |
| anticoag_status | VARCHAR(50) | |
| notes | TEXT | |
| cteph_screening_done | BOOLEAN | |
| created_at | TIMESTAMPTZ | |

## RLS
All 3 tables: FORCE RLS + tenant_isolation.

## Indexes
- `pe_dvt_cases`: (tenant_id, severity), (patient_id), (status)
- `pe_dvt_treatments`: (tenant_id, case_id), (started_at DESC)
- `pe_dvt_followups`: (tenant_id, followup_date DESC)
