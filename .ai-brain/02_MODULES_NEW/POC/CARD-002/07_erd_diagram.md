<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — ERD (Mermaid)

`mermaid
erDiagram
    tenants ||--o{ cardiac_cath_procedures : has
    tenants ||--o{ pci_records : has
    tenants ||--o{ stent_registry : has
    tenants ||--o{ structural_heart_mdt : has
    tenants ||--o{ tavr_workup : has
    tenants ||--o{ cath_lab_scheduling : has
    tenants ||--o{ contrast_tracking : has
    tenants ||--o{ radiation_dose_log : has
    tenants ||--o{ cath_lab_equipment : has
    tenants ||--o{ cath_lab_red_flags : has
    tenants ||--o{ cath_audit_log : has
    tenants ||--o{ cath_consent : has

    cardiac_cath_procedures ||--o{ pci_records : produces
    cardiac_cath_procedures ||--o{ stent_registry : uses
    cardiac_cath_procedures ||--o{ radiation_dose_log : logs
    cardiac_cath_procedures ||--o{ cath_lab_red_flags : has
    cardiac_cath_procedures ||--o{ cath_consent : has
    cardiac_cath_procedures ||--o{ contrast_tracking : tracks

    structural_heart_mdt ||--o{ tavr_workup : refers

    cardiac_cath_procedures {
        uuid id PK
        uuid tenant_id FK
        bigint patient_id
        bigint encounter_id
        varchar procedure_type
        text indication
        varchar urgency
        varchar access_route
        smallint sheath_size_fr
        timestamptz door_time
        timestamptz balloon_time
        int d2b_minutes
        boolean d2b_compliant
        bigint operator_user_id
        varchar status
        bytea findings_encrypted
        jsonb complications
        jsonb cpt_codes
        timestamptz created_at
        timestamptz soft_deleted_at
    }

    pci_records {
        uuid id PK
        uuid tenant_id FK
        uuid procedure_id FK
        smallint lesion_count
        jsonb lesions
        int syntax_score
        int grace_score
        smallint timi_score
        smallint pre_timi_flow
        smallint post_timi_flow
        numeric residual_stenosis_pct
        jsonb devices
        bigint operator_cosign_user_id
    }

    stent_registry {
        uuid id PK
        uuid tenant_id FK
        uuid procedure_id FK
        bigint patient_id
        varchar udi
        varchar manufacturer
        varchar model
        numeric size_diameter_mm
        smallint length_mm
        varchar batch_lot
        date expiration_date
        varchar vessel
        timestamptz sfda_reported_at
        timestamptz implanted_at
    }

    structural_heart_mdt {
        uuid id PK
        uuid tenant_id FK
        bigint patient_id
        uuid referral_id
        timestamptz mdt_date
        varchar indication
        jsonb members_present
        numeric sts_score
        text recommendation
        varchar status
    }

    tavr_workup {
        uuid id PK
        uuid tenant_id FK
        bigint patient_id
        uuid mdt_id FK
        numeric ct_annular_area_mm2
        varchar access_route_planned
        varchar valve_size_predicted
        jsonb frailty_assessment
    }

    contrast_tracking {
        uuid id PK
        uuid tenant_id FK
        bigint patient_id
        uuid procedure_id FK
        int contrast_volume_ml
        numeric baseline_egfr
        numeric post_egfr_48h
        boolean cin_event
    }

    radiation_dose_log {
        uuid id PK
        uuid tenant_id FK
        uuid procedure_id FK
        bigint staff_id
        varchar role
        numeric role_dose_mgy
        numeric role_dap_gy_cm2
        numeric cumulative_ytd_mgy
    }

    cath_lab_red_flags {
        uuid id PK
        uuid tenant_id FK
        uuid procedure_id FK
        varchar flag_type
        timestamptz detected_at
        int response_time_seconds
    }

    cath_audit_log {
        uuid id PK
        uuid tenant_id FK
        uuid procedure_id FK
        bigint user_id
        varchar action
        varchar input_hash
        varchar output_hash
        varchar prev_hash
    }

    cath_consent {
        uuid id PK
        uuid tenant_id FK
        bigint patient_id
        uuid procedure_id FK
        varchar consent_type
        text consent_text_ar
        text consent_text_en
        timestamptz signed_at
        bigint signed_by
        bigint witness_id
    }
`

---
*Section 34 of CARD-002. SA voice. L1 DRAFT.*