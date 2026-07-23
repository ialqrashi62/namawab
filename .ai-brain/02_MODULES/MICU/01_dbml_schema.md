# MICU — DBML Schema (Database Markup Language)

```dbml
Project nama_medical {
  database_type: 'PostgreSQL'
  Note: 'MICU - Medical ICU'
}

Table icu_admissions {
  id bigserial [pk]
  tenant_id uuid [not null, ref: > tenants.id]
  encounter_id bigint [not null, ref: > encounters.id]
  patient_id bigint [not null, ref: > patients.id]
  admitted_at timestamptz [not null]
  discharged_at timestamptz
  admitting_md_id bigint [ref: > users.id]
  primary_diagnosis text
  apache_ii_score int
  sofa_score int
  code_status varchar(20) // 'FULL', 'DNR', 'DNI', 'AND'
  isolation_required boolean
  isolation_type varchar(50)
  created_at timestamptz [default: `NOW()`]
  Indexes {
    (tenant_id, admitted_at) [name: 'idx_icu_tenant_admit']
  }
}

Table icu_vitals {
  id bigserial [pk]
  tenant_id uuid [not null]
  admission_id bigint [not null, ref: > icu_admissions.id]
  recorded_at timestamptz [not null]
  heart_rate int
  systolic_bp int
  diastolic_bp int
  map int
  respiratory_rate int
  spo2 int
  temperature_c decimal(4,1)
  gcs_total int
  rass int
  urine_output_ml int
  pain_score int
  Indexes {
    (admission_id, recorded_at) [name: 'idx_vitals_admission_time']
  }
}

Table icu_scores {
  id bigserial [pk]
  tenant_id uuid [not null]
  admission_id bigint [not null, ref: > icu_admissions.id]
  score_type varchar(20) // 'APACHE_II', 'SOFA', 'GCS', 'RASS', 'CAM_ICU', 'BRADEN'
  score_value decimal(5,2)
  subscores jsonb
  calculated_at timestamptz [not null]
  calculated_by_user_id bigint [ref: > users.id]
}

Table icu_ventilator {
  id bigserial [pk]
  tenant_id uuid [not null]
  admission_id bigint [not null, ref: > icu_admissions.id]
  started_at timestamptz [not null]
  ended_at timestamptz
  mode varchar(30) // 'AC', 'SIMV', 'PS', 'PRVC', 'HFOV', 'NIV'
  set_rate int
  total_rate int
  tidal_volume_set int
  tidal_volume_exhaled int
  peep int
  fio2 decimal(4,2)
  plateau_pressure int
  peak_pressure int
  compliance decimal(5,1)
  rsbi int // rapid shallow breathing index
  proning boolean [default: false]
  Indexes {
    (admission_id, started_at) [name: 'idx_vent_admission_time']
  }
}

Table icu_vasoactive_drips {
  id bigserial [pk]
  tenant_id uuid [not null]
  admission_id bigint [not null, ref: > icu_admissions.id]
  drug_name varchar(50) // norepinephrine, epinephrine, etc.
  started_at timestamptz [not null]
  ended_at timestamptz
  dose_mcg_kg_min decimal(6,3)
  titration_reason text
  ordered_by_user_id bigint [ref: > users.id]
}

Table icu_medications {
  id bigserial [pk]
  tenant_id uuid [not null]
  admission_id bigint [not null, ref: > icu_admissions.id]
  medication_id bigint [ref: > medications.id]
  drug_name varchar(200)
  dose varchar(50)
  route varchar(30)
  frequency varchar(50)
  started_at timestamptz
  stopped_at timestamptz
  indication text
  is_high_alert boolean [default: false]
}

Table icu_labs {
  id bigserial [pk]
  tenant_id uuid [not null]
  admission_id bigint [not null, ref: > icu_admissions.id]
  collected_at timestamptz [not null]
  test_name varchar(50)
  value varchar(50)
  unit varchar(20)
  is_critical boolean [default: false]
  critical_callback_at timestamptz
  critical_callback_by_user_id bigint [ref: > users.id]
}

Table icu_procedures {
  id bigserial [pk]
  tenant_id uuid [not null]
  admission_id bigint [not null, ref: > icu_admissions.id]
  procedure_name varchar(100)
  performed_at timestamptz
  performed_by_user_id bigint [ref: > users.id]
  complications text
  consent_obtained boolean
  site_marked boolean // for invasive procedures
  timeout_performed boolean // WHO checklist
}

Table icu_sepsis_bundle {
  id bigserial [pk]
  tenant_id uuid [not null]
  admission_id bigint [not null, ref: > icu_admissions.id]
  bundle_started_at timestamptz [not null]
  lactate_drawn_at timestamptz
  lactate_value decimal(4,1)
  cultures_drawn_at timestamptz
  abx_started_at timestamptz
  abx_name varchar(200)
  fluid_started_at timestamptz
  fluid_volume_ml int
  vasopressor_started_at timestamptz
  bundle_completed_at timestamptz
  bundle_compliance_hours decimal(4,2)
  compliance_status varchar(20) // 'COMPLIANT', 'DELAYED', 'MISSED'
}

Table icu_code_status {
  id bigserial [pk]
  tenant_id uuid [not null]
  admission_id bigint [not null, ref: > icu_admissions.id]
  status varchar(20) // 'FULL', 'DNR', 'DNI', 'AND', 'COMFORT'
  effective_at timestamptz
  documented_by_user_id bigint [ref: > users.id]
  family_meeting boolean
  advance_directive boolean
}

Table icu_delirium_assessments {
  id bigserial [pk]
  tenant_id uuid [not null]
  admission_id bigint [not null, ref: > icu_admissions.id]
  assessed_at timestamptz
  cam_icu_result varchar(10) // 'POSITIVE', 'NEGATIVE', 'UNABLE'
  rass_score int
  precipitating_factors text
  interventions text
}

Table icu_daily_rounds {
  id bigserial [pk]
  tenant_id uuid [not null]
  admission_id bigint [not null, ref: > icu_admissions.id]
  rounded_at timestamptz [not null]
  problem_list jsonb
  plan_by_problem jsonb
  goals_for_day text
  attendees jsonb // ['MD', 'RN', 'RT', 'Pharm', 'Nutr', 'PT']
  family_communicated boolean
}

Table icu_isolation_orders {
  id bigserial [pk]
  tenant_id uuid [not null]
  admission_id bigint [not null, ref: > icu_admissions.id]
  isolation_type varchar(50) // 'CONTACT', 'DROPLET', 'AIRBORNE', 'NEUTROPENIC'
  ordered_at timestamptz
  ordered_by_user_id bigint [ref: > users.id]
  reason text
  ended_at timestamptz
}

Table icu_lines_drains {
  id bigserial [pk]
  tenant_id uuid [not null]
  admission_id bigint [not null, ref: > icu_admissions.id]
  device_type varchar(50) // 'CENTRAL_LINE', 'ARTERIAL_LINE', 'CHEST_TUBE', 'FOLEY', 'NG', 'ET_TUBE'
  inserted_at timestamptz
  site varchar(50)
  inserted_by_user_id bigint [ref: > users.id]
  removed_at timestamptz
  days_in_place int
  culture_drawn boolean
  indication text
}

TableGroup micu_tables {
  icu_admissions
  icu_vitals
  icu_scores
  icu_ventilator
  icu_vasoactive_drips
  icu_medications
  icu_labs
  icu_procedures
  icu_sepsis_bundle
  icu_code_status
  icu_delirium_assessments
  icu_daily_rounds
  icu_isolation_orders
  icu_lines_drains
}
```

## Row-Level Security
```sql
ALTER TABLE icu_admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_admissions FORCE ROW LEVEL SECURITY;
CREATE POLICY icu_tenant_isolation ON icu_admissions
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

## Indexes
- (tenant_id, admitted_at) on icu_admissions
- (admission_id, recorded_at) on icu_vitals
- (admission_id, started_at) on icu_ventilator
- HNSW on vector columns
