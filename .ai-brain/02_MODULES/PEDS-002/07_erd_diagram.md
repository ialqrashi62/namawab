# PEDS-002 — ERD Diagram

```mermaid
erDiagram
    TENANTS ||--o{ PEDS_NICU_ADMISSIONS : has
    PATIENTS ||--o{ PEDS_NICU_ADMISSIONS : admits
    ENCOUNTERS ||--o| PEDS_NICU_ADMISSIONS : context
    PEDS_NICU_ADMISSIONS ||--|{ PEDS_NICU_VITALS : monitored
    PEDS_NICU_ADMISSIONS ||--o{ PEDS_NICU_RESPIRATORY : on
    PEDS_NICU_ADMISSIONS ||--o{ PEDS_NICU_MEDICATIONS : given
    PEDS_NICU_ADMISSIONS ||--o{ PEDS_NICU_FEEDS : fed
    PEDS_NICU_ADMISSIONS ||--o{ PEDS_NICU_PROCEDURES : performed
    PEDS_NICU_ADMISSIONS ||--o{ PEDS_NICU_SCREENINGS : screened
    PEDS_NICU_ADMISSIONS ||--o{ PEDS_NICU_DEVELOPMENTAL : assessed
    PEDS_NICU_ADMISSIONS ||--o{ PEDS_NICU_PARENTS : contact
    USERS ||--o{ PEDS_NICU_ADMISSIONS : admits
    USERS ||--o{ PEDS_NICU_PROCEDURES : performs

    PEDS_NICU_ADMISSIONS {
        bigserial id PK
        uuid tenant_id
        bigint patient_id FK
        timestamptz admitted_at
        int birth_weight_grams
        int gestational_age_weeks
        int apgar_1min
        int apgar_5min
        varchar level_of_care
        varchar respiratory_support
    }
    PEDS_NICU_VITALS {
        bigserial id PK
        uuid tenant_id
        bigint admission_id FK
        timestamptz recorded_at
        int heart_rate
        int respiratory_rate
        int spo2
        decimal temperature_c
        int weight_grams
    }
    PEDS_NICU_RESPIRATORY {
        bigserial id PK
        uuid tenant_id
        bigint admission_id FK
        varchar support_type
        decimal fio2
        int peep
        int surfactant_dose
    }
    PEDS_NICU_MEDICATIONS {
        bigserial id PK
        uuid tenant_id
        bigint admission_id FK
        varchar drug_name
        varchar dose
        boolean is_weight_based
        int weight_at_order
    }
```

## Indexes
- (tenant_id, admitted_at) on peds_nicu_admissions
- (admission_id, recorded_at) on peds_nicu_vitals
- HNSW on vector columns

## RLS
- All tables: FORCE_RLS = ON
- Tenant isolation: USING (tenant_id = current_setting('app.tenant_id')::uuid)
