# CARD-001 — ERD Diagram

```mermaid
erDiagram
    TENANTS ||--o{ CARD_ENCOUNTERS : has
    PATIENTS ||--o{ CARD_ENCOUNTERS : has
    CARD_ENCOUNTERS ||--|{ CARD_ECGS : monitored
    CARD_ENCOUNTERS ||--o{ CARD_TROPONINS : tested
    CARD_ENCOUNTERS ||--o{ CARD_ECHOCARDIOGRAMS : imaged
    CARD_ENCOUNTERS ||--o{ CARD_PROCEDURES : performed
    CARD_ENCOUNTERS ||--o{ CARD_MEDICATIONS : given
    PATIENTS ||--o{ CARD_DEVICES : implanted
    USERS ||--o{ CARD_ENCOUNTERS : admits
    USERS ||--o{ CARD_PROCEDURES : performs

    CARD_ENCOUNTERS {
        bigserial id PK
        uuid tenant_id
        bigint patient_id FK
        timestamptz started_at
        varchar encounter_type
        text primary_diagnosis
        varchar disposition
    }
    CARD_ECGS {
        bigserial id PK
        uuid tenant_id
        bigint encounter_id FK
        timestamptz recorded_at
        varchar rhythm
        int rate
        int qtc_ms
        text interpretation
        boolean critical_findings
    }
    CARD_TROPONINS {
        bigserial id PK
        uuid tenant_id
        bigint encounter_id FK
        timestamptz collected_at
        decimal troponin_value
        boolean is_elevated
    }
    CARD_ECHOCARDIOGRAMS {
        bigserial id PK
        uuid tenant_id
        bigint encounter_id FK
        timestamptz study_date
        decimal ef_percent
        jsonb valvular_function
    }
    CARD_PROCEDURES {
        bigserial id PK
        uuid tenant_id
        bigint encounter_id FK
        varchar procedure_name
        timestamptz procedure_date
        int stents_placed
    }
    CARD_MEDICATIONS {
        bigserial id PK
        uuid tenant_id
        bigint encounter_id FK
        varchar medication_name
        boolean is_anticoag
        boolean is_antiplatelet
    }
    CARD_DEVICES {
        bigserial id PK
        uuid tenant_id
        bigint patient_id FK
        varchar device_type
        timestamptz implanted_at
        varchar battery_status
    }
```

## Indexes
- (tenant_id, started_at) on card_encounters
- (encounter_id, recorded_at) on card_ecgs
- (encounter_id, collected_at) on card_troponins
- (patient_id) on card_devices
- HNSW on vector columns

## RLS
- FORCE_RLS = ON
- Tenant isolation
