# P0-1 Patient Portal — Data Model

## Tables (5)

### 1. `pp_appointments`
Patient appointment records (Mawid integration).

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT NOT NULL | Multi-tenant |
| patient_id | INT NOT NULL | FK patient |
| facility_id | INT NOT NULL | FK facility |
| specialty | VARCHAR(50) | cardiology/derm/etc. |
| appointment_date | DATE | |
| appointment_time | VARCHAR(10) | HH:MM |
| status | VARCHAR(20) | confirmed/pending/cancelled/completed/no_show |
| appointment_id | VARCHAR(50) UNIQUE | Mawid ID |
| insurance_approved | BOOLEAN | Wateen check |
| cost | NUMERIC(8,2) | SAR |
| teleconsult_url | VARCHAR(255) | For video visits |
| created_by | INT | FK user |
| created_at | TIMESTAMPTZ | |

### 2. `pp_vitals`
Self-reported vital signs.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT NOT NULL | |
| patient_id | INT NOT NULL | FK patient |
| type | VARCHAR(30) | systolic_bp/diastolic_bp/glucose/weight_kg/heart_rate/spo2/temperature_c |
| value | NUMERIC(10,2) | |
| unit | VARCHAR(20) | |
| abnormal | BOOLEAN | Out of range flag |
| measured_at | TIMESTAMPTZ | |
| source | VARCHAR(20) | self_reported/device_sync/manual_entry |
| created_by | INT | FK user |
| created_at | TIMESTAMPTZ | |

### 3. `pp_refill_requests`
Medication refill requests (PDPL-aware, controlled-substance blocked).

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT NOT NULL | |
| patient_id | INT NOT NULL | FK patient |
| prescription_id | INT | FK prescription |
| status | VARCHAR(20) | pending/approved/rejected/dispensed |
| approved_by | INT | FK pharmacist |
| approved_at | TIMESTAMPTZ | |
| created_by | INT | FK user |
| created_at | TIMESTAMPTZ | |

### 4. `pp_caregivers`
Caregiver proxy access (PDPL Right to Family Access).

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT NOT NULL | |
| patient_id | INT NOT NULL | FK patient |
| caregiver_national_id | VARCHAR(20) NOT NULL | Nafath-verified |
| relationship | VARCHAR(30) | spouse/parent/child/sibling/legal_guardian |
| consent_doc_id | VARCHAR(50) NOT NULL | PDPL doc |
| expires_at | DATE | |
| active | BOOLEAN DEFAULT TRUE | |
| created_by | INT | FK user |
| created_at | TIMESTAMPTZ | |

### 5. `pp_consent_log`
PDPL consent trail (audit-grade).

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| tenant_id | INT NOT NULL | |
| patient_id | INT NOT NULL | |
| withdrawal_type | VARCHAR(50) | data_processing/research/marketing/third_party_sharing |
| effective_at | TIMESTAMPTZ | |
| created_by | INT | FK user |
| created_at | TIMESTAMPTZ | |

## RLS (CRITICAL — Patient PHI)
All 5 tables: FORCE RLS + tenant_isolation policy.

Additional patient-level access control:
- Patients can ONLY see their own data
- Caregivers can see patient data ONLY with active proxy
- Clinicians can see patient data ONLY with care relationship

## Indexes
- `pp_appointments`: (tenant_id, patient_id, appointment_date)
- `pp_vitals`: (tenant_id, patient_id, measured_at DESC)
- `pp_refill_requests`: (tenant_id, patient_id, status)
- `pp_caregivers`: (tenant_id, patient_id, active)
- `pp_consent_log`: (tenant_id, patient_id)

## Compliance
- PDPL: All patient data encrypted at rest (rails #7)
- Audit: Hash-chained log, 7+ years retention (rails #10)
- No PHI in logs (rails #12)
