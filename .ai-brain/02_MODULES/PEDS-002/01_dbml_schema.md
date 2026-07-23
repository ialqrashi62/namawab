# PEDS-002 — DBML Schema

```dbml
Table peds_nicu_admissions {
  id bigserial [pk]
  uuid tenant_id
  bigint patient_id
  bigint encounter_id
  timestamptz admitted_at
  timestamptz discharged_at
  bigint admitting_md_id
  text primary_diagnosis
  int birth_weight_grams
  int gestational_age_weeks
  int apgar_1min
  int apgar_5min
  int apgar_10min
  varchar delivery_mode
  boolean multiple_birth
  varchar sex
  varchar level_of_care // 'II', 'III', 'IV'
  varchar respiratory_support
  boolean surfactant_given
  date central_line_date
  timestamptz first_breastfeed_at
}

Table peds_nicu_vitals {
  id bigserial [pk]
  uuid tenant_id
  bigint admission_id
  timestamptz recorded_at
  int heart_rate
  int respiratory_rate
  int spo2
  decimal temperature_c
  int bp_systolic
  int bp_diastolic
  int map
  int weight_grams
  decimal head_circumference_cm
  decimal length_cm
  decimal urine_output_ml_kg_h
}

Table peds_nicu_respiratory {
  id bigserial [pk]
  uuid tenant_id
  bigint admission_id
  timestamptz started_at
  timestamptz ended_at
  varchar support_type
  decimal fio2
  int pip
  int peep
  int rate
  int mean_airway_pressure
  int amplitude
  int surfactant_dose
}

Table peds_nicu_medications {
  id bigserial [pk]
  uuid tenant_id
  bigint admission_id
  varchar drug_name
  varchar dose
  varchar route
  varchar frequency
  timestamptz started_at
  timestamptz stopped_at
  text indication
  boolean is_weight_based
  int weight_at_order
}

Table peds_nicu_feeds {
  id bigserial [pk]
  uuid tenant_id
  bigint admission_id
  varchar feed_type
  decimal feed_volume_ml
  timestamptz started_at
  timestamptz stopped_at
  varchar route
  boolean breast_milk
  varchar fortification
  boolean parenteral_nutrition
}

Table peds_nicu_screenings {
  id bigserial [pk]
  uuid tenant_id
  bigint admission_id
  varchar screening_type // 'ROP', 'HEARING', 'METABOLIC', 'CARDIAC'
  timestamptz screening_date
  varchar result
  text follow_up
}

Table peds_nicu_developmental {
  id bigserial [pk]
  uuid tenant_id
  bigint admission_id
  timestamptz assessment_date
  int age_corrected_weeks
  text motor_skills
  text cognitive_skills
  text language_skills
  text follow_up_plan
}

Table peds_nicu_parents {
  id bigserial [pk]
  uuid tenant_id
  bigint admission_id
  varchar parent_name
  varchar relationship
  varchar phone
  int visit_count
  int kangaroo_care_count
  boolean breastfeeding_education
}
```

## RLS
- All tables: USING (tenant_id = current_setting('app.tenant_id')::uuid)
- FORCE_RLS = ON

## Storage
- peds_nicu_admissions: 1K/yr/tenant × 10 = 10K rows → 2 MB
- peds_nicu_vitals: q1h × 30 days avg = 720/patient × 10K = 7.2M → 1.5 GB
- peds_nicu_medications: 20/patient × 10K = 200K → 30 MB
- **Total: ~1.5 GB / 10 years**
