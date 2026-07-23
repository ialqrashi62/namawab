# SURG-001 — DBML Schema

```dbml
Table surg_procedures {
  id bigserial [pk]
  uuid tenant_id
  bigint patient_id
  bigint encounter_id
  timestamptz scheduled_at
  timestamptz started_at
  timestamptz ended_at
  varchar procedure_name
  varchar cpt_code
  varchar icd10_code
  varchar urgency // 'ELECTIVE', 'URGENT', 'EMERGENCY'
  varchar asa_class
  varchar wound_class
  bigint surgeon_user_id
  bigint assistant_user_id
  bigint anesthetist_user_id
  boolean npo_confirmed
  boolean site_marked
  boolean antibiotic_given
  varchar antibiotic_name
  timestamptz antibiotic_time
  boolean consent_signed
  text anesthesia_plan
  boolean vte_prophylaxis
  varchar vte_type
}

Table surg_intraop {
  id bigserial [pk]
  uuid tenant_id
  bigint procedure_id
  varchar anesthesia_type
  int estimated_blood_loss_ml
  boolean timeout_performed
  boolean site_marked
  boolean counts_correct
  int sponges_count
  int instruments_count
  int sharps_count
  text procedure_performed
  text findings
  text complications
  text specimens
  text implants_used
  int estimated_duration_min
  boolean normothermia_maintained
  boolean glycemic_control
}

Table surg_postop {
  id bigserial [pk]
  uuid tenant_id
  bigint procedure_id
  varchar disposition
  text pain_management
  text diet_plan
  text activity_plan
  text wound_care
  text drains
  text iv_fluids
  text medications
  text follow_up_plan
  int estimated_los_days
  bigint documented_by_user_id
}

Table surg_complications {
  id bigserial [pk]
  uuid tenant_id
  bigint procedure_id
  varchar complication_type
  timestamptz complication_date
  varchar severity
  int clavien_dindo_grade
  text treatment
  text outcome
  bigint reported_by_user_id
}

Table surg_drains {
  id bigserial [pk]
  uuid tenant_id
  bigint procedure_id
  varchar drain_type
  varchar drain_site
  timestamptz inserted_at
  timestamptz removed_at
  int output_24h_ml
  varchar character
}

Table surg_wound_care {
  id bigserial [pk]
  uuid tenant_id
  bigint procedure_id
  timestamptz assessment_date
  varchar wound_status
  varchar drainage
  boolean erythema
  boolean dehiscence
  boolean ssi_signs
  text action_taken
  bigint assessed_by_user_id
}
```

## RLS
- All tables: FORCE_RLS = ON
- Tenant isolation

## Storage
- surg_procedures: 5K/yr/tenant × 10 = 50K → 10 MB
- surg_intraop: 50K rows → 5 MB
- surg_complications: 5K rows → 1 MB
- **Total: ~20 MB / 10 years**
