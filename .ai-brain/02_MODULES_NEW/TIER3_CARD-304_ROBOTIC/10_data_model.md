# CARD-304_ROBOTIC — Data Model

## Tables (4)

### 1. `robotic_cv_cases`
Cardiac surgery candidate registry.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT NOT NULL | |
| patient_id | INT NOT NULL | FK patient |
| diagnosis | VARCHAR(100) | mitral_regurgitation/aortic_stenosis/cad/asd/etc. |
| procedure_type | VARCHAR(50) | robotic_mitral_repair/tavi/etc. |
| device | VARCHAR(50) | davinci_xi/sapien_3/etc. |
| sts_score | NUMERIC(5,2) | |
| euroscore_ii | NUMERIC(5,2) | |
| ef_pct | INT | 0-100 |
| status | VARCHAR(20) | pending/completed/declined/deceased |
| created_by | INT | FK user |
| created_at, updated_at | TIMESTAMPTZ | |

### 2. `robotic_cv_procedures`
Surgery records.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT | |
| case_id | INT | FK |
| patient_id | INT | |
| procedure_date | DATE | |
| console_hours | NUMERIC(4,1) | |
| bypass_time_min | INT | |
| cross_clamp_min | INT | |
| conversion_to_open | BOOLEAN | |
| success | BOOLEAN | |
| complications | TEXT | |
| created_at | TIMESTAMPTZ | |

### 3. `robotic_cv_followups`
Post-op surveillance.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT | |
| case_id | INT | FK |
| patient_id | INT | |
| followup_date | DATE | |
| followup_type | VARCHAR(50) | routine/annual/complication |
| echo_findings | TEXT | |
| valve_function | VARCHAR(50) | normal/mild_leak/moderate_leak/severe_leak |
| complications | TEXT | |
| notes | TEXT | |
| created_at | TIMESTAMPTZ | |

### 4. `robotic_cv_devices`
Device registry (SFDA tracking).

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT | |
| device_serial | VARCHAR(100) | |
| device_type | VARCHAR(50) | davinci_xi/sapien_3/mitraclip_g4/etc. |
| manufacture_date | DATE | |
| lot_number | VARCHAR(50) | |
| sfda_registration | VARCHAR(50) | |
| status | VARCHAR(20) | active/maintenance/retired |
| procedures_count | INT | |
| last_maintenance | DATE | |
| next_maintenance | DATE | |
| created_at | TIMESTAMPTZ | |

## RLS
All 4 tables: FORCE RLS + tenant_isolation.

## Indexes
- `robotic_cv_cases`: (tenant_id, patient_id), (procedure_type, status)
- `robotic_cv_procedures`: (tenant_id, procedure_date DESC), (case_id)
- `robotic_cv_followups`: (tenant_id, followup_date DESC), (case_id)
- `robotic_cv_devices`: (tenant_id, device_type), (status)
