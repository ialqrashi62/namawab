# 18 — ERD Diagram (CARD-001)

> Owner: SA · Tier 1

```mermaid
erDiagram
    TENANTS ||--o{ PATIENTS : has
    TENANTS ||--o{ ENCOUNTERS : has
    TENANTS ||--o{ USERS : has
    TENANTS ||--o{ FACILITIES : has

    PATIENTS ||--o{ ENCOUNTERS : has
    PATIENTS ||--o{ ALLERGIES : has
    PATIENTS ||--o{ VITALS : has
    PATIENTS ||--o{ LAB_RESULTS : has
    PATIENTS ||--o{ MEDICATIONS : takes
    PATIENTS ||--o{ DIAGNOSES : has

    ENCOUNTERS ||--o{ ENCOUNTER_NOTES : contains
    ENCOUNTERS ||--o{ ORDERS : places
    ENCOUNTERS ||--o{ ECG_RECORDS : produces
    ENCOUNTERS ||--o{ ECHO_REPORTS : produces
    ENCOUNTERS ||--o{ STRESS_TESTS : produces
    ENCOUNTERS ||--o{ HOLTER_REPORTS : produces
    ENCOUNTERS ||--o{ CATH_REPORTS : produces
    ENCOUNTERS ||--o{ DEVICE_IMPLANTS : produces
    ENCOUNTERS ||--o{ REHAB_PLANS : produces
    ENCOUNTERS ||--o{ CARDIOLOGY_COPILOT_QUERIES : has
    ENCOUNTERS ||--o{ RED_FLAG_ACTIVATIONS : has
    ENCOUNTERS ||--o{ NPHIES_CLAIMS : submits

    USERS ||--o{ ENCOUNTERS : conducts
    USERS ||--o{ ECG_RECORDS : interprets
    USERS ||--o{ ECHO_REPORTS : interprets
    USERS ||--o{ CATH_REPORTS : performs
    USERS ||--o{ DEVICE_IMPLANTS : implants

    ECG_RECORDS ||--o{ ECG_FINDINGS : has
    ECHO_REPORTS ||--o{ ECHO_MEASUREMENTS : has
    CATH_REPORTS ||--o{ CATH_FINDINGS : has
    CATH_REPORTS ||--o{ CATH_INTERVENTIONS : has
    DEVICE_IMPLANTS ||--o{ DEVICE_LEADS : has
    DEVICE_IMPLANTS ||--o{ DEVICE_FOLLOWUPS : has

    RED_FLAG_ACTIVATIONS ||--o{ RED_FLAG_TIMELINE : has
    RED_FLAG_ACTIVATIONS ||--o{ RED_FLAG_NOTIFICATIONS : has

    CARDIOLOGY_COPILOT_QUERIES ||--o{ COPILOT_RETRIEVALS : has
    CARDIOLOGY_COPILOT_QUERIES ||--o{ COPILOT_RESPONSES : has

    NPHIES_CLAIMS ||--o{ NPHIES_CLAIM_LINES : has

    PATIENTS {
      uuid id PK
      uuid tenant_id FK
      text mrn
      text name_ar
      text name_en
      date dob
      text sex
      text national_id
      text insurance_no
      text insurance_payer
      text blood_type
      jsonb chronic_conditions
      jsonb cardiac_history
      timestamp created_at
      timestamp updated_at
    }
    ENCOUNTERS {
      uuid id PK
      uuid tenant_id FK
      uuid facility_id FK
      uuid patient_id FK
      uuid doctor_id FK
      text type
      text status
      timestamp started_at
      timestamp ended_at
      text chief_complaint
      text diagnosis_primary
      jsonb diagnosis_secondary
      text disposition
      jsonb red_flags
    }
    ECG_RECORDS {
      uuid id PK
      uuid tenant_id FK
      uuid encounter_id FK
      uuid interpreted_by FK
      timestamp recorded_at
      text file_uri
      int rate
      text rhythm
      int pr_ms
      int qrs_ms
      int qtc_ms
      int axis_deg
      jsonb st_per_lead
      jsonb q_per_lead
      text impression
      text urgency
      bool red_flag
      text signed_by
      timestamp signed_at
    }
    CATH_REPORTS {
      uuid id PK
      uuid tenant_id FK
      uuid encounter_id FK
      uuid performed_by FK
      text procedure_type
      timestamp procedure_at
      text access_site
      jsonb findings
      jsonb interventions
      text complications
      text conclusion
      int contrast_ml
      int fluoro_minutes
      int dose_mgy
      text nphies_bundle
      decimal amount_total
      text status
    }
    DEVICE_IMPLANTS {
      uuid id PK
      uuid tenant_id FK
      uuid encounter_id FK
      uuid implanted_by FK
      text device_type
      text manufacturer
      text model
      text serial
      timestamp implanted_at
      jsonb leads
      int battery_estimated_years
      text nphies_bundle
      decimal amount_total
    }
    REHAB_PLANS {
      uuid id PK
      uuid tenant_id FK
      uuid encounter_id FK
      text indication
      int sessions_planned
      text exercise_modality
      jsonb sessions_completed
      text status
    }
    CARDIOLOGY_COPILOT_QUERIES {
      uuid id PK
      uuid tenant_id FK
      uuid user_id FK
      uuid encounter_id FK
      text question
      uuid patient_id
      text intent
      jsonb retrieval_chunks
      text answer_ar
      text answer_en
      jsonb citations
      text evidence_level
      jsonb cds_rules
      bool red_flag
      text trace_id
      int input_tokens
      int output_tokens
      decimal cost_usd
    }
    RED_FLAG_ACTIVATIONS {
      uuid id PK
      uuid tenant_id FK
      uuid encounter_id FK
      uuid patient_id FK
      uuid activated_by FK
      text red_flag_id
      text severity
      timestamp activated_at
      timestamp closed_at
      text status
      jsonb timeline
      jsonb notifications
    }
    NPHIES_CLAIMS {
      uuid id PK
      uuid tenant_id FK
      uuid encounter_id FK
      uuid patient_id FK
      text nphies_claim_id
      text bundle
      decimal amount
      text status
      timestamp submitted_at
      text response_code
    }
```

## Key indexes

- `encounters(tenant_id, patient_id, started_at DESC)` — patient timeline
- `encounters(tenant_id, doctor_id, started_at DESC)` — doctor workload
- `ecg_records(tenant_id, patient_id, recorded_at DESC)` — ECG history
- `ecg_records(red_flag=true, signed_at IS NULL)` — unsigned red-flag ECG
- `cath_reports(tenant_id, encounter_id)` — per-encounter cath
- `device_implants(tenant_id, patient_id, implanted_at DESC)` — device history
- `red_flag_activations(tenant_id, status, activated_at DESC)` — active red flags
- `cardiology_copilot_queries(tenant_id, encounter_id, created_at DESC)` — copilot history
- `nphies_claims(tenant_id, status, submitted_at DESC)` — claim status

## PHI columns (encrypted via crypto_envelope)

- `patients.national_id` (when present)
- `patients.insurance_no`
- `ecg_records.file_uri` (DICOM/PNG path → phi_vault)
- `echo_reports.file_uri`
- `cath_reports.fluoro_video_uri`
- `device_implants.serial`
