# CARD-301_STROKE — ERD (Mermaid)

```mermaid
erDiagram
    PATIENT ||--o{ STROKE_CASES : has
    ENCOUNTER ||--o{ STROKE_CASES : generates
    STROKE_CASES ||--o{ STROKE_THROMBOLYSIS : "treated_with"
    STROKE_CASES ||--o{ STROKE_THROMBECTOMY : "treated_with"
    STROKE_CASES ||--o{ STROKE_IMAGING : "imaged_by"
    STROKE_CASES ||--o{ STROKE_FOLLOWUP : "followed_up"
    USER ||--o{ STROKE_CASES : "assigned_to"
    USER ||--o{ STROKE_THROMBOLYSIS : "ordered_by"

    STROKE_CASES {
        int id PK
        int tenant_id
        int patient_id FK
        int encounter_id FK
        string stroke_type
        timestamp arrival_time
        timestamp last_known_well
        int nihss_score
        string ct_findings
        int aspects_score
        bool code_stroke_activated
        bool admitted_to_stroke_unit
        string status
        int assigned_neurologist FK
        int created_by FK
    }

    STROKE_THROMBOLYSIS {
        int id PK
        int tenant_id
        int stroke_case_id FK
        int patient_id FK
        string agent
        decimal dose_mg
        decimal weight_kg
        timestamp administered_at
        int door_to_needle_minutes
        int nihss_before
        int nihss_after_24h
        text complications
        bool consent_obtained
        string consent_witness
        int ordering_physician FK
    }

    STROKE_THROMBECTOMY {
        int id PK
        int tenant_id
        int stroke_case_id FK
        int patient_id FK
        timestamp procedure_time
        int door_to_groin_minutes
        int tici_score
        timestamp groin_puncture_time
        timestamp reperfusion_time
        int mrs_24h
        int mrs_7d
        int mrs_30d
        text complications
        string operator
    }

    STROKE_IMAGING {
        int id PK
        int tenant_id
        int stroke_case_id FK
        int patient_id FK
        string imaging_type
        timestamp performed_at
        text findings
        int aspects_score
        string occlusion_site
        text perfusion_findings
        string radiologist
    }

    STROKE_FOLLOWUP {
        int id PK
        int tenant_id
        int stroke_case_id FK
        int patient_id FK
        date followup_date
        int mrs_score
        bool medication_adherent
        bool bp_at_goal
        bool recurrent_event
        string rehab_status
        text notes
    }
```

## Cardinality
- 1 patient → N stroke cases
- 1 stroke case → 1 thrombolysis (if eligible)
- 1 stroke case → 1 thrombectomy (if LVO)
- 1 stroke case → N imaging studies
- 1 stroke case → N followups (30d, 90d, 1y)

## Indexes
- `stroke_cases`: (tenant_id, patient_id), (arrival_time DESC)
- `stroke_thrombolysis`: (tenant_id, administered_at DESC), (door_to_needle_minutes)
- `stroke_thrombectomy`: (tenant_id, mrs_30d)
- `stroke_imaging`: (tenant_id, patient_id)
- `stroke_followup`: (tenant_id, followup_date DESC)
