# CARD-001 — DBML Schema

```dbml
Table card_encounters {
  id bigserial [pk]
  uuid tenant_id
  bigint patient_id FK
  bigint encounter_id
  varchar encounter_type // 'CHEST_PAIN', 'HF_EXAC', 'AF', 'POST_PCI'
  timestamptz started_at
  timestamptz ended_at
  text primary_diagnosis
  jsonb severity_score
  varchar disposition
}

Table card_ecgs {
  id bigserial [pk]
  uuid tenant_id
  bigint encounter_id FK
  timestamptz recorded_at
  int rate
  varchar rhythm // 'SINUS', 'AFIB', 'AFLUT', 'VT', 'SVT'
  int pr_interval_ms
  int qrs_duration_ms
  int qtc_ms
  int axis
  jsonb st_elevation
  jsonb st_depression
  text t_wave
  text q_waves
  text interpretation
  boolean critical_findings
}

Table card_troponins {
  id bigserial [pk]
  uuid tenant_id
  bigint encounter_id FK
  timestamptz collected_at
  decimal troponin_value
  varchar troponin_unit // 'NG_ML', 'NG_L'
  varchar assay_type // 'HS_TNI', 'TNT'
  int url_value
  boolean is_elevated
  decimal delta_change
}

Table card_echocardiograms {
  id bigserial [pk]
  uuid tenant_id
  bigint encounter_id FK
  timestamptz study_date
  decimal ef_percent
  jsonb lv_dimensions
  jsonb valvular_function
  jsonb wall_motion
  int pulmonary_pressure_sys
  boolean pericardial_effusion
}

Table card_procedures {
  id bigserial [pk]
  uuid tenant_id
  bigint encounter_id FK
  varchar procedure_name // 'PCI', 'CABG', 'ABLATION', 'TEE', 'CARDIOVERSION', 'PACEMAKER', 'ICD', 'TAVR'
  timestamptz procedure_date
  text indication
  text findings
  int stents_placed
  int contrast_volume_ml
  decimal fluoroscopy_time_min
  decimal radiation_dose_mgy
}

Table card_medications {
  id bigserial [pk]
  uuid tenant_id
  bigint encounter_id FK
  varchar medication_name
  varchar dose
  varchar frequency
  text indication
  timestamptz started_at
  timestamptz stopped_at
  boolean is_anticoag
  boolean is_antiplatelet
}

Table card_devices {
  id bigserial [pk]
  uuid tenant_id
  bigint patient_id FK
  varchar device_type // 'PACEMAKER', 'ICD', 'CRT', 'LOOP_RECORDER', 'WATCHMAN'
  varchar manufacturer
  varchar model
  varchar serial_number
  timestamptz implanted_at
  varchar battery_status
  varchar lead_status
  timestamptz last_check_at
  timestamptz next_check_at
}
```

## RLS
- All tables: FORCE_RLS = ON

## Storage
- card_encounters: 5K/yr/tenant × 10 = 50K → 10 MB
- card_ecgs: 50K/yr/tenant × 10 = 500K → 80 MB
- card_troponins: 30K/yr/tenant × 10 = 300K → 30 MB
- card_medications: 200K → 30 MB
- **Total: ~150 MB / 10 years**
