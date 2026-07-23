# OBG-001 — DBML Schema

```dbml
Project nama_medical {
  database_type: 'PostgreSQL'
  Note: 'OBG-001 - Obstetrics and Gynecology'
}

Table obg_pregnancies {
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint [not null, ref: > patients.id]
  encounter_id bigint [ref: > encounters.id]
  lmp_date date
  edd_date date
  gestational_age_weeks int
  gravida int
  para int
  abortions int
  living int
  blood_type varchar(5)
  rh_factor varchar(2)
  antibody_screen varchar(50)
  rubella_immune boolean
  varicella_immune boolean
  hepatitis_b_status varchar(20)
  hiv_status varchar(20)
  syphilis_screen varchar(20)
  gbs_status varchar(20)
  pre_pregnancy_weight_kg decimal(5,1)
  height_cm int
  bmi decimal(4,1)
  risk_level varchar(20)
  created_at timestamptz [default: `NOW()`]
  Indexes {
    (tenant_id, patient_id) [name: 'idx_preg_tenant_patient']
  }
}

Table obg_prenatal_visits {
  id bigserial [pk]
  tenant_id uuid [not null]
  pregnancy_id bigint [not null, ref: > obg_pregnancies.id]
  visit_date timestamptz [not null]
  gestational_age_weeks int
  weight_kg decimal(5,1)
  bp_systolic int
  bp_diastolic int
  fundal_height_cm decimal(4,1)
  fetal_heart_rate int
  urine_protein varchar(20)
  urine_glucose varchar(20)
  edema varchar(20)
  complaints text
  plan text
  next_visit_date date
  performed_by_user_id bigint
}

Table obg_deliveries {
  id bigserial [pk]
  tenant_id uuid [not null]
  pregnancy_id bigint [not null, ref: > obg_pregnancies.id]
  patient_id bigint [not null, ref: > patients.id]
  delivery_date timestamptz [not null]
  delivery_mode varchar(20) // 'SVD', 'OPERATIVE_VD', 'C_SECTION', 'VBAC'
  gestational_age_at_delivery int
  labor_induction boolean
  labor_augmentation boolean
  labor_duration_hours decimal(4,1)
  stage_2_duration_min int
  placenta_delivery_method varchar(30)
  estimated_blood_loss_ml int
  episiotomy boolean
  laceration varchar(20) // 'NONE', '1ST', '2ND', '3RD', '4TH'
  complications text
  apgar_1min int
  apgar_5min int
  apgar_10min int
  cord_ph decimal(4,2)
  performed_by_user_id bigint
  assistant_user_id bigint
}

Table obg_newborns {
  id bigserial [pk]
  tenant_id uuid [not null]
  delivery_id bigint [not null, ref: > obg_deliveries.id]
  sex varchar(1) // 'M', 'F', 'A' (ambiguous)
  weight_grams int
  length_cm decimal(4,1)
  head_circumference_cm decimal(4,1)
  apgar_1min int
  apgar_5min int
  apgar_10min int
  resuscitation_required boolean
  nicu_admission boolean
  breastfeeding_initiated boolean
  congenital_anomalies text
  vitamin_k_given boolean
  hepatitis_b_vaccine boolean
  eye_prophylaxis boolean
  hearing_screening varchar(20)
  newborn_screening varchar(20)
}

Table obg_preeclampsia_screenings {
  id bigserial [pk]
  tenant_id uuid [not null]
  pregnancy_id bigint [not null, ref: > obg_pregnancies.id]
  visit_id bigint [ref: > obg_prenatal_visits.id]
  bp_systolic int
  bp_diastolic int
  proteinuria varchar(20) // 'NIL', 'TRACE', '1+', '2+', '3+', '4+'
  protein_creatinine_ratio decimal(5,2)
  symptoms text
  aspartate_aminotransferase int
  alanine_aminotransferase int
  platelets int
  creatinine decimal(4,2)
  uric_acid decimal(5,2)
  ld_h int
  classification varchar(30) // 'NORMAL', 'GESTATIONAL_HTN', 'PREECLAMPSIA', 'SEVERE', 'ECLAMPSIA', 'HELLP'
}

Table obg_gdm_screenings {
  id bigserial [pk]
  tenant_id uuid [not null]
  pregnancy_id bigint [not null, ref: > obg_pregnancies.id]
  test_type varchar(20) // 'GLUCOSE_CHALLENGE', 'OGTT_50G', 'OGTT_75G', 'OGTT_100G'
  test_date date
  fasting_mg_dl int
  one_hour_mg_dl int
  two_hour_mg_dl int
  three_hour_mg_dl int
  result varchar(20) // 'NORMAL', 'GDM', 'IFG'
}

Table obg_ultrasounds {
  id bigserial [pk]
  tenant_id uuid [not null]
  pregnancy_id bigint [not null, ref: > obg_pregnancies.id]
  ultrasound_date timestamptz
  gestational_age_weeks int
  type varchar(20) // 'FIRST_TRIMESTER', 'ANOMALY', 'GROWTH', 'BIOPHYSICAL', 'DOPPLER'
  findings text
  estimated_fetal_weight_g int
  amniotic_fluid_index decimal(4,1)
  umbilical_artery_doppler varchar(20)
  cervical_length_cm decimal(4,1)
  performed_by_user_id bigint
}

Table obg_medications {
  id bigserial [pk]
  tenant_id uuid [not null]
  pregnancy_id bigint [not null, ref: > obg_pregnancies.id]
  medication_name varchar(200)
  dose varchar(50)
  frequency varchar(50)
  indication text
  pregnancy_category varchar(5) // 'A','B','C','D','X'
  is_safe_in_pregnancy boolean
  started_at timestamptz
  stopped_at timestamptz
  prescribed_by_user_id bigint
}

Table obg_gynecological_visits {
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint [not null, ref: > patients.id]
  visit_date timestamptz
  chief_complaint text
  menarche_age int
  last_menstrual_period date
  menstrual_cycle_length int
  menstrual_duration int
  contraceptive_use varchar(50)
  pap_smear_date date
  pap_smear_result varchar(50)
  hpv_test_date date
  hpv_result varchar(50)
  pelvic_exam text
  breast_exam text
  plan text
  performed_by_user_id bigint
}

Table obg_procedures {
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint [not null, ref: > patients.id]
  procedure_name varchar(100) // 'D&C', 'C_SECTION', 'HYSTERECTOMY', 'OOPHORECTOMY', 'LAPAROSCOPY', 'HYSTEROSCOPY'
  procedure_date timestamptz
  indication text
  findings text
  estimated_blood_loss_ml int
  complications text
  performed_by_user_id bigint
  assistant_user_id bigint
}

Table obg_postpartum_followup {
  id bigserial [pk]
  tenant_id uuid [not null]
  delivery_id bigint [not null, ref: > obg_deliveries.id]
  followup_date timestamptz
  bleeding_status varchar(20)
  perineal_healing varchar(20)
  breastfeeding_status varchar(20)
  mood_screening varchar(20) // 'NORMAL', 'BABY_BLUE', 'PPD_SUSPECTED'
  contraception_plan text
  lochia_status varchar(20)
  uterine_involution text
  follow_up_plan text
  performed_by_user_id bigint
}

Table obg_vector_index {
  id bigserial [pk]
  tenant_id uuid [not null]
  module_id varchar(20) [default: 'OBG-001']
  index_name varchar(100)
  chunk_id varchar(100)
  chunk_text text
  embedding VECTOR(768)
  metadata jsonb
}

TableGroup obg_tables {
  obg_pregnancies
  obg_prenatal_visits
  obg_deliveries
  obg_newborns
  obg_preeclampsia_screenings
  obg_gdm_screenings
  obg_ultrasounds
  obg_medications
  obg_gynecological_visits
  obg_procedures
  obg_postpartum_followup
  obg_vector_index
}
```

## RLS
- All tables: `USING (tenant_id = current_setting('app.tenant_id')::uuid)`
- FORCE_RLS = ON
- PHI protection: pregnancy data is sensitive (PDPL)

## Indexes
- (tenant_id, patient_id) on obg_pregnancies
- (pregnancy_id, visit_date) on obg_prenatal_visits
- (delivery_date) on obg_deliveries
- HNSW on vector columns
