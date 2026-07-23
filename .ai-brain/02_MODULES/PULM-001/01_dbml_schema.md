# PULM-001 — DBML

```dbml
Table pulm_encounters {
  id bigserial [pk]
  uuid tenant_id
  bigint patient_id
  bigint encounter_id
  varchar encounter_type
  timestamptz started_at
  timestamptz ended_at
  text primary_diagnosis
  jsonb severity_score
  varchar disposition
}

Table pulm_pft {
  id bigserial [pk]
  uuid tenant_id
  bigint encounter_id
  timestamptz test_date
  decimal fev1
  decimal fev1_percent_predicted
  decimal fvc
  decimal fvc_percent_predicted
  decimal fev1_fvc_ratio
  decimal tlc
  decimal rv
  decimal dlco
  varchar pattern // 'OBSTRUCTIVE', 'RESTRICTIVE', 'MIXED', 'NORMAL'
  varchar severity
  boolean bronchodilator_response
}

Table pulm_imaging {
  id bigserial [pk]
  uuid tenant_id
  bigint encounter_id
  varchar imaging_type
  timestamptz imaging_date
  text findings
  text impression
  boolean critical_findings
}

Table pulm_medications {
  id bigserial [pk]
  uuid tenant_id
  bigint encounter_id
  varchar medication_name
  varchar dose
  varchar frequency
  varchar route // 'INH', 'PO', 'IV', 'SC'
  boolean is_oxygen
}

Table pulm_oxygen_orders {
  id bigserial [pk]
  uuid tenant_id
  bigint encounter_id
  varchar delivery_method // 'NC', 'SIMPLE_MASK', 'NRB', 'HFNC', 'CPAP', 'BIPAP'
  decimal flow_rate_l_min
  decimal fio2
  int target_spo2_low
  int target_spo2_high
}

Table pulm_procedures {
  id bigserial [pk]
  uuid tenant_id
  bigint encounter_id
  varchar procedure_name // 'BRONCHOSCOPY', 'EBUS', 'BAL', 'BIOPSY', 'THORACENTESIS', 'CHEST_TUBE'
  timestamptz procedure_date
  text findings
  text pathology
}
```

## RLS: FORCE_RLS = ON
## Storage: ~50 MB / 10yr / tenant
