# CARD-303_ONCO — Data Model

## Tables (4)

### 1. `cardio_onc_cases`
Cardio-Onc patient registry.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT NOT NULL | |
| patient_id | INT NOT NULL | FK patient |
| cancer_type | VARCHAR(50) | breast/lung/etc. |
| cancer_stage | VARCHAR(5) | I/II/III/IV |
| cancer_diagnosis_date | DATE | |
| cancer_therapy | VARCHAR(50) | anthracycline/trastuzumab/ici/etc. |
| hfa_icos_risk | VARCHAR(20) | low/moderate/high/very_high |
| baseline_ef_pct | INT | 0-100 |
| baseline_gls_pct | NUMERIC(4,1) | % |
| comorbidity | TEXT | |
| status | VARCHAR(20) | active/completed/deceased |
| created_by | INT | FK user |
| created_at, updated_at | TIMESTAMPTZ | |

### 2. `cardiotoxicity_events`
Cardiotoxicity event tracking.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT | |
| case_id | INT | FK |
| patient_id | INT | |
| event_type | VARCHAR(50) | anthracycline_tox/trastuzumab_tox/ |
| ctcae_grade | VARCHAR(5) | I/II/III/IV/V |
| ef_pct | INT | |
| gls_pct | NUMERIC(4,1) | |
| troponin | NUMERIC(7,2) | ng/mL |
| bnp | INT | pg/mL |
| symptoms | TEXT | |
| treatment_initiated | BOOLEAN | |
| cancer_therapy_modified | BOOLEAN | |
| reversible | BOOLEAN | |
| event_date | DATE | |
| created_at | TIMESTAMPTZ | |

### 3. `ici_myocarditis`
Immune checkpoint inhibitor myocarditis tracking.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT | |
| case_id | INT | FK |
| patient_id | INT | |
| ici_type | VARCHAR(50) | pembrolizumab/nivolumab/atezolizumab/durvalumab/ipilimumab |
| symptom_onset_date | DATE | |
| troponin | NUMERIC(7,2) | ng/mL |
| ef_pct | INT | |
| ecg_findings | TEXT | |
| mri_findings | TEXT | |
| treatment | TEXT | |
| severity | VARCHAR(20) | mild/moderate/severe/fulminant |
| outcome | TEXT | |
| created_at | TIMESTAMPTZ | |

### 4. `vte_cancer`
Cancer-associated VTE registry.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT | |
| patient_id | INT | |
| cancer_type | VARCHAR(50) | |
| vte_type | VARCHAR(20) | DVT/PE/both |
| location | VARCHAR(50) | proximal/distal/etc. |
| diagnosis_date | DATE | |
| treatment_drug | VARCHAR(50) | Apixaban/Edoxaban/LMWH |
| dose_mg | NUMERIC(6,2) | |
| treatment_duration_months | INT | |
| recurrence | BOOLEAN | |
| major_bleeding | BOOLEAN | |
| on_chemo | BOOLEAN | |
| created_at | TIMESTAMPTZ | |

## RLS
All 4 tables: FORCE RLS + tenant_isolation.

## Indexes
- `cardio_onc_cases`: (tenant_id, patient_id), (cancer_type, hfa_icos_risk)
- `cardiotoxicity_events`: (tenant_id, ctcae_grade), (event_date DESC)
- `ici_myocarditis`: (tenant_id, severity), (symptom_onset_date DESC)
- `vte_cancer`: (tenant_id, cancer_type), (diagnosis_date DESC)
