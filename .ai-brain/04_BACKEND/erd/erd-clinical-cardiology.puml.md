# ERD — Clinical Subspecialty (Cardiology Example)

> Pattern repeats for each of 60 departments.

```plantuml
@startuml nama_erd_cardiology
hide circles
skinparam linetype ortho

class cardiology_assessments {
  +assessment_id PK
  +tenant_id FK
  +patient_id FK
  +encounter_id FK
  +chest_pain_type
  +ejection_fraction
  +nyha_class
  +risk_score
  +created_at
}

class cardiology_ekgs {
  +ekg_id PK
  +tenant_id FK
  +patient_id FK
  +assessment_id FK
  +rhythm
  +st_elevation
  +q_waves
  +interpretation_enc
  +created_at
}

class cardiology_echo {
  +echo_id PK
  +tenant_id FK
  +patient_id FK
  +encounter_id FK
  +lvef_pct
  +valve_abnormalities
  +diastolic_dysfunction
  +created_at
}

class cardiology_meds {
  +med_id PK
  +tenant_id FK
  +patient_id FK
  +encounter_id FK
  +drug_class
  +dose
  +frequency
  +created_at
}

cardiology_assessments ||--o{ cardiology_ekgs
cardiology_assessments ||--o{ cardiology_echo
patients ||--o{ cardiology_assessments
patients ||--o{ cardiology_meds

@enduml
```

## Subspecialty Tables (60 departments)

| Specialty | Primary Tables |
|---|---|
| Cardiology | assessments, ekg, echo, meds |
| Nephrology | dialysis_sessions, kt_v_urea, access_type |
| OB/GYN | prenatal_visits, ultrasound, deliveries |
| Oncology | tumor_board, regimens, cycles |
| Surgery | pre_op_assessments, procedures, post_op |
| Pediatrics | growth_charts, immunization, milestones |
| Emergency | triage, vitals, disposition |
| ICU | vents, scoring, fluids_io |
| ... | (60 total) |
