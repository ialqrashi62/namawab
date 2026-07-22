# DBML Fragment — Cardiology (full)

> **Owner:** Architect
> **Date:** 2026-07-22
> **Append to:** `docs/erd/cardiology.dbml`

```dbml
Table cardiac_procedures {
  id bigserial [pk]
  tenant_id bigint [not null, ref > tenants.id]
  patient_id bigint [not null, ref > patients.id]
  procedure_type varchar(64) [not null]  // 'cath', 'pci', 'tavr', 'ablation', 'device_implant', 'ep_study', 'icd', 'ppm', 'crt'
  indication text [not null]
  status varchar(32) [not null, default 'scheduled']
  scheduled_at timestamptz
  started_at timestamptz
  completed_at timestamptz
  operator_id bigint [ref > system_users.id]
  findings text
  complications text
  cpt_code varchar(16)
  door_to_balloon_minutes int  // for STEMI
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
  
  Note: 'Cardiac procedures. RLS by tenant_id. PHI encrypted in text columns.'
}

Table echo_reports {
  id bigserial [pk]
  tenant_id bigint [not null]
  patient_id bigint [not null]
  study_date timestamptz [not null]
  study_type varchar(32) [not null]  // 'tte', 'tee', 'stress_echo', 'contrast_echo'
  lvef_percent decimal(5,2)
  lvef_method varchar(16)  // 'simpson', 'visual', '3d'
  valve_assessment text  // PHI-encrypted
  wall_motion text
  pericardial_effusion varchar(32)  // 'none', 'trivial', 'mild', 'moderate', 'severe'
  pulmonary_pressure_sys decimal(5,2)
  aortic_root_cm decimal(4,1)
  la_size_cm decimal(4,1)
  image_dicom_url text
  report_text text
  signed_by bigint [ref > system_users.id]
  signed_at timestamptz
  created_at timestamptz [default: `now()`]
  
  Note: 'Echocardiogram reports. TTE/TEE/stress. RLS by tenant_id.'
}

Table ecg_archive {
  id bigserial [pk]
  tenant_id bigint [not null]
  patient_id bigint [not null]
  study_date timestamptz [not null]
  ecg_type varchar(32) [not null]  // '12_lead', 'rhythm_strip', 'holter_24h', 'holter_48h', 'event_recorder'
  rhythm varchar(64)
  rate_bpm int
  pr_ms int
  qrs_ms int
  qt_ms int
  qtc_ms int
  axis_deg int
  interpretation text
  image_url text
  ai_interpretation text
  signed_by bigint [ref > system_users.id]
  created_at timestamptz [default: `now()`]
  
  Note: 'ECG archive (12-lead + rhythm + Holter). AI interpretation optional. RLS by tenant_id.'
}

Table holter_studies {
  id bigserial [pk]
  tenant_id bigint [not null]
  patient_id bigint [not null]
  study_start timestamptz [not null]
  study_end timestamptz [not null]
  duration_hours int
  total_beats bigint
  af_burden_percent decimal(5,2)
  pvc_count int
  pvc_burden_percent decimal(5,2)
  pauses_max_sec decimal(4,2)
  min_hr_bpm int
  max_hr_bpm int
  avg_hr_bpm int
  findings text
  signed_by bigint [ref > system_users.id]
  signed_at timestamptz
  created_at timestamptz [default: `now()`]
}

Table stress_tests {
  id bigserial [pk]
  tenant_id bigint [not null]
  patient_id bigint [not null]
  study_date timestamptz [not null]
  test_type varchar(32) [not null]  // 'exercise_treadmill', 'dobutamine', 'adenosine', 'treadmill_echo', 'nuclear_mpi'
  protocol varchar(32)  // 'bruce', 'modified_bruce', 'naughton'
  duration_minutes decimal(5,2)
  max_hr_achieved int
  max_hr_predicted int
  hr_percent_predicted int
  bp_response text
  symptoms text
  ecg_changes text
  imaging_findings text
  result varchar(32)  // 'positive', 'negative', 'equivocal', 'inconclusive'
  signed_by bigint [ref > system_users.id]
  created_at timestamptz [default: `now()`]
}

Table cardiac_rehab_enrollment {
  id bigserial [pk]
  tenant_id bigint [not null]
  patient_id bigint [not null]
  enrollment_date date [not null]
  indication varchar(64)  // 'post_mi', 'post_cabg', 'post_pci', 'chf', 'valve_surgery'
  sessions_attended int [default: 0]
  sessions_total int [default: 36]
  completion_status varchar(32) [default: 'active']
  notes text
  created_at timestamptz [default: `now()`]
}

Table anticoagulation_clinic_visits {
  id bigserial [pk]
  tenant_id bigint [not null]
  patient_id bigint [not null]
  visit_date date [not null]
  inr_value decimal(4,2)
  warfarin_dose_mg decimal(5,2)
  doac_name varchar(64)
  doac_dose_mg decimal(5,2)
  trend_arrow varchar(8)
  action text
  next_visit_date date
  created_at timestamptz [default: `now()`]
}

Table lipid_clinic_followup {
  id bigserial [pk]
  tenant_id bigint [not null]
  patient_id bigint [not null]
  visit_date date [not null]
  ldl_cholesterol decimal(5,2)
  hdl_cholesterol decimal(5,2)
  triglycerides decimal(6,2)
  total_cholesterol decimal(5,2)
  lp_a decimal(6,2)
  statin_name varchar(64)
  statin_dose_mg decimal(5,2)
  pcsk9_inhibitor varchar(64)
  notes text
  created_at timestamptz [default: `now()`]
}
```

## Indexes (PostgreSQL)

```sql
CREATE INDEX idx_cardiac_proc_patient ON cardiac_procedures(patient_id, scheduled_at DESC);
CREATE INDEX idx_cardiac_proc_status ON cardiac_procedures(tenant_id, status) WHERE status IN ('scheduled', 'in_progress');
CREATE INDEX idx_echo_patient_date ON echo_reports(patient_id, study_date DESC);
CREATE INDEX idx_ecg_patient_date ON ecg_archive(patient_id, study_date DESC);
CREATE INDEX idx_holter_patient ON holter_studies(patient_id, study_start DESC);
CREATE INDEX idx_stress_patient ON stress_tests(patient_id, study_date DESC);
CREATE INDEX idx_anticoag_due ON anticoagulation_clinic_visits(tenant_id, next_visit_date) WHERE next_visit_date IS NOT NULL;
CREATE INDEX idx_lipid_patient ON lipid_clinic_followup(patient_id, visit_date DESC);
```

## RLS Policies

```sql
-- All tables have tenant_id NOT NULL
-- All have ENABLE + FORCE RLS
-- All have policy: USING (tenant_id = current_setting('app.tenant_id')::BIGINT)
```

---

End of DBML.
