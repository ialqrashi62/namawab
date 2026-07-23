# OBG-001 — ERD Diagram

```mermaid
erDiagram
    TENANTS ||--o{ OBG_PREGNANCIES : has
    PATIENTS ||--o{ OBG_PREGNANCIES : pregnant
    ENCOUNTERS ||--o{ OBG_PREGNANCIES : context
    OBG_PREGNANCIES ||--o{ OBG_PRENATAL_VISITS : has
    OBG_PREGNANCIES ||--o{ OBG_DELIVERIES : results
    OBG_PREGNANCIES ||--o{ OBG_PREECLAMPSIA_SCREENINGS : screened
    OBG_PREGNANCIES ||--o{ OBG_GDM_SCREENINGS : tested
    OBG_PREGNANCIES ||--o{ OBG_ULTRASOUNDS : imaged
    OBG_PREGNANCIES ||--o{ OBG_MEDICATIONS : prescribed
    OBG_DELIVERIES ||--o{ OBG_NEWBORNS : delivered
    OBG_DELIVERIES ||--o{ OBG_POSTPARTUM_FOLLOWUP : followed
    PATIENTS ||--o{ OBG_GYNECOLOGICAL_VISITS : visits
    PATIENTS ||--o{ OBG_PROCEDURES : undergoes
    USERS ||--o{ OBG_PRENATAL_VISITS : performs
    USERS ||--o{ OBG_DELIVERIES : delivers
    USERS ||--o{ OBG_PROCEDURES : performs

    OBG_PREGNANCIES {
        bigserial id PK
        uuid tenant_id
        bigint patient_id FK
        date lmp_date
        date edd_date
        int gravida
        int para
        varchar blood_type
        varchar rh_factor
        decimal bmi
        varchar risk_level
    }
    OBG_PRENATAL_VISITS {
        bigserial id PK
        uuid tenant_id
        bigint pregnancy_id FK
        timestamptz visit_date
        int gestational_age_weeks
        decimal weight_kg
        int bp_systolic
        int bp_diastolic
        decimal fundal_height_cm
        int fetal_heart_rate
    }
    OBG_DELIVERIES {
        bigserial id PK
        uuid tenant_id
        bigint pregnancy_id FK
        timestamptz delivery_date
        varchar delivery_mode
        int gestational_age_at_delivery
        int estimated_blood_loss_ml
        int apgar_1min
        int apgar_5min
    }
    OBG_NEWBORNS {
        bigserial id PK
        uuid tenant_id
        bigint delivery_id FK
        varchar sex
        int weight_grams
        int apgar_1min
        int apgar_5min
        boolean nicu_admission
    }
    OBG_PREECLAMPSIA_SCREENINGS {
        bigserial id PK
        uuid tenant_id
        bigint pregnancy_id FK
        int bp_systolic
        int bp_diastolic
        varchar proteinuria
        varchar classification
    }
    OBG_GDM_SCREENINGS {
        bigserial id PK
        uuid tenant_id
        bigint pregnancy_id FK
        varchar test_type
        int fasting_mg_dl
        int one_hour_mg_dl
        int two_hour_mg_dl
        varchar result
    }
    OBG_ULTRASOUNDS {
        bigserial id PK
        uuid tenant_id
        bigint pregnancy_id FK
        varchar ultrasound_type
        int estimated_fetal_weight_g
        decimal amniotic_fluid_index
    }
    OBG_POSTPARTUM_FOLLOWUP {
        bigserial id PK
        uuid tenant_id
        bigint delivery_id FK
        timestamptz followup_date
        varchar mood_screening
        text contraception_plan
    }
```

## Indexes
- (tenant_id, patient_id) on obg_pregnancies
- (pregnancy_id, visit_date) on obg_prenatal_visits
- (delivery_date) on obg_deliveries
- (pregnancy_id, screening_date) on obg_preeclampsia_screenings
- HNSW on vector columns

## RLS
- All tables: FORCE_RLS = ON
- Tenant isolation: USING (tenant_id = current_setting('app.tenant_id')::uuid)

## Storage Estimates
- obg_pregnancies: 1K/yr/tenant × 10 = 10K rows → 2 MB
- obg_prenatal_visits: 10K/yr/tenant × 10 = 100K → 15 MB
- obg_deliveries: 1K/yr/tenant × 10 = 10K → 2 MB
- obg_newborns: 1K/yr/tenant × 10 = 10K → 1 MB
- obg_ultrasounds: 3K/yr/tenant × 10 = 30K → 5 MB
- **Total per tenant: ~25 MB / 10 years**
