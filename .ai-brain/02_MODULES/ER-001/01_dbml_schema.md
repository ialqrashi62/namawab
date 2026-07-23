---
module_id: ER-001
section: 03_technical_arch
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 DBML Schema (dbdiagram.io compatible)

## Overview
ER-001 module schema in PostgreSQL 16, multi-tenant via `tenant_id`,
RLS enabled, FORCE_RLS=150. All PHI columns encrypted via `crypto_envelope`.

## DBML Source

```dbml
Project namaweb_er {
  database_type: 'PostgreSQL'
  Note: 'Emergency Department module — NamaMedical ERP'
}

TableGroup er_group [headercolor: #DC3545] {
  er_encounters
  er_vitals
  er_triage_decisions
  er_red_flags
  er_medications_admin
  er_dispositions
  er_codes
  er_procedures
  er_imaging_orders
  er_lab_orders
  er_notes
  er_consultations
  er_audit_log
  er_vector_chunks
}

Table er_encounters {
  id uuid [pk, default: `gen_random_uuid()`]
  tenant_id uuid [not null, ref: > tenants.id]
  facility_id uuid [ref: > facilities.id]
  patient_id uuid [not null, ref: > patients.id]
  mrn varchar(50) [not null]
  encounter_class varchar(20) [not null, default: 'EMER']
  arrival_time timestamptz [not null]
  triage_time timestamptz
  provider_first_seen_time timestamptz
  disposition_time timestamptz
  discharge_time timestamptz
  esi_level int [not null, note: '1=resus, 2=emergent, 3=urgent, 4=less, 5=non-urgent']
  chief_complaint text [not null, note: 'encrypted column']
  hpi text [note: 'encrypted column']
  primary_diagnosis_icd10 varchar(10)
  secondary_diagnoses_icd10 text[] [note: 'encrypted column']
  disposition varchar(30) [note: 'admit | discharge | transfer | ama | deceased | obs']
  disposition_destination varchar(100)
  primary_provider_id uuid [ref: > system_users.id]
  attending_md_id uuid [ref: > system_users.id]
  triage_rn_id uuid [ref: > system_users.id]
  status varchar(20) [not null, default: 'open']
  is_critical tinyint [not null, default: 0]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  soft_deleted tinyint [not null, default: 0]
  
  Note: 'Main encounter record — one per ED visit'
  Indexes {
    (tenant_id, patient_id) [name: 'idx_er_encounters_tenant_patient']
    (tenant_id, arrival_time) [name: 'idx_er_encounters_tenant_arrival']
    (tenant_id, esi_level, status) [name: 'idx_er_encounters_esi_status']
    (tenant_id, is_critical, status) [name: 'idx_er_encounters_critical']
    mrn [name: 'idx_er_encounters_mrn']
  }
}

Table er_vitals {
  id uuid [pk]
  tenant_id uuid [not null]
  encounter_id uuid [not null, ref: > er_encounters.id]
  recorded_at timestamptz [not null]
  bp_systolic int
  bp_diastolic int
  heart_rate int
  respiratory_rate int
  spo2 int [note: 'percentage 0-100']
  temperature_c decimal(4,1)
  pain_score int [note: '0-10']
  gcs_total int [note: '3-15']
  gcs_components jsonb
  recorded_by uuid [not null, ref: > system_users.id]
  
  Indexes {
    (tenant_id, encounter_id, recorded_at) [name: 'idx_er_vitals_encounter_time']
  }
}

Table er_triage_decisions {
  id uuid [pk]
  tenant_id uuid [not null]
  encounter_id uuid [not null, ref: > er_encounters.id]
  esi_level int [not null]
  decision_source varchar(20) [not null, note: 'ai | rn | md | override']
  confidence decimal(4,2)
  override_reason text [note: 'required if override']
  decided_by uuid [not null, ref: > system_users.id]
  decided_at timestamptz [not null, default: `now()`]
  supervisor_cosign_id uuid [ref: > system_users.id]
  supervisor_cosign_at timestamptz
  
  Indexes {
    (tenant_id, encounter_id) [name: 'idx_er_triage_encounter']
  }
}

Table er_red_flags {
  id uuid [pk]
  tenant_id uuid [not null]
  encounter_id uuid [not null, ref: > er_encounters.id]
  flag_type varchar(50) [not null, note: 'cardiac_arrest, stemi, stroke, sepsis, anaphylaxis, trauma, etc.']
  category int [not null, note: '1-5 (severity)']
  severity varchar(20) [not null, note: 'critical | emergent | urgent | high_risk | psych']
  detected_at timestamptz [not null]
  detected_by varchar(20) [not null, note: 'ai | rn | md | monitor | patient']
  detection_method varchar(50)
  response_action varchar(100) [not null, note: 'code_blue, code_stemi, sepsis_bundle, etc.']
  response_time_seconds int
  acknowledged_by uuid [ref: > system_users.id]
  acknowledged_at timestamptz
  resolved_at timestamptz
  resolution_notes text
  
  Indexes {
    (tenant_id, encounter_id) [name: 'idx_er_red_flags_encounter']
    (tenant_id, category, detected_at) [name: 'idx_er_red_flags_category_time']
  }
}

Table er_medications_admin {
  id uuid [pk]
  tenant_id uuid [not null]
  encounter_id uuid [not null, ref: > er_encounters.id]
  drug_id uuid [ref: > drugs.id]
  drug_name varchar(200) [not null]
  rxnorm_code varchar(20)
  dose varchar(50) [not null]
  route varchar(30) [not null, note: 'PO, IV, IM, SC, etc.']
  frequency varchar(50)
  indication text [note: 'encrypted column']
  five_rights_check jsonb [note: 'right_patient, right_drug, right_dose, right_route, right_time']
  allergy_check_passed tinyint [not null, default: 0]
  interaction_check_passed tinyint [not null, default: 0]
  renal_dose_checked tinyint [not null, default: 0]
  pregnancy_checked tinyint [not null, default: 0]
  given_by uuid [not null, ref: > system_users.id]
  given_at timestamptz [not null, default: `now()`]
  witnessed_by uuid [ref: > system_users.id, note: 'for high-alert drugs']
  
  Indexes {
    (tenant_id, encounter_id, given_at) [name: 'idx_er_meds_encounter_time']
  }
}

Table er_dispositions {
  id uuid [pk]
  tenant_id uuid [not null]
  encounter_id uuid [not null, ref: > er_encounters.id]
  disposition_type varchar(30) [not null, note: 'admit, discharge, transfer, ama, deceased, obs']
  destination varchar(100)
  receiving_unit varchar(50)
  receiving_provider_id uuid [ref: > system_users.id]
  time_ordered timestamptz
  time_completed timestamptz
  discharge_instructions text [note: 'encrypted column']
  follow_up_arranged tinyint
  follow_up_provider varchar(200)
  follow_up_timeframe varchar(50)
  patient_education text [note: 'encrypted column']
  decided_by uuid [not null, ref: > system_users.id]
  created_at timestamptz [not null, default: `now()`]
  
  Indexes {
    (tenant_id, encounter_id) [name: 'idx_er_dispo_encounter']
  }
}

Table er_codes {
  id uuid [pk]
  tenant_id uuid [not null]
  encounter_id uuid [not null, ref: > er_encounters.id]
  code_type varchar(30) [not null, note: 'blue, stemi, stroke, trauma, sepsis, mass_casualty']
  activated_at timestamptz [not null]
  activated_by uuid [not null, ref: > system_users.id]
  team_arrival_times jsonb [note: 'each team member arrival timestamp']
  procedure_times jsonb [note: 'CPR start, first shock, intubation, etc.']
  outcomes jsonb [note: 'rosc_time, mortality, etc.']
  completed_at timestamptz
  documented_by uuid [ref: > system_users.id]
  
  Indexes {
    (tenant_id, code_type, activated_at) [name: 'idx_er_codes_type_time']
  }
}

Table er_procedures {
  id uuid [pk]
  tenant_id uuid [not null]
  encounter_id uuid [not null, ref: > er_encounters.id]
  procedure_id uuid [ref: > procedures_catalog.id]
  cpt_code varchar(20)
  snomed_code varchar(30)
  procedure_name varchar(200) [not null]
  performed_at timestamptz [not null]
  performed_by uuid [not null, ref: > system_users.id]
  assistant_id uuid [ref: > system_users.id]
  time_to_perform_minutes int
  complications text
  consent_obtained tinyint [not null, default: 0]
  consent_witness_id uuid [ref: > system_users.id]
  
  Indexes {
    (tenant_id, encounter_id) [name: 'idx_er_procedures_encounter']
  }
}

Table er_imaging_orders {
  id uuid [pk]
  tenant_id uuid [not null]
  encounter_id uuid [not null, ref: > er_encounters.id]
  modality varchar(20) [not null, note: 'X-ray, CT, MRI, US, etc.']
  body_part varchar(50)
  indication text
  priority varchar(20) [not null, note: 'stat, urgent, routine']
  contrast_used tinyint [not null, default: 0]
  contrast_type varchar(30)
  pregnancy_check_done tinyint [not null, default: 0]
  renal_function_checked tinyint [not null, default: 0]
  ordered_by uuid [not null, ref: > system_users.id]
  ordered_at timestamptz [not null, default: `now()`]
  performed_at timestamptz
  reported_at timestamptz
  radiologist_id uuid [ref: > system_users.id]
  finding_summary text [note: 'encrypted column']
  critical_finding tinyint [not null, default: 0]
  
  Indexes {
    (tenant_id, encounter_id) [name: 'idx_er_imaging_encounter']
    (tenant_id, critical_finding, reported_at) [name: 'idx_er_imaging_critical']
  }
}

Table er_lab_orders {
  id uuid [pk]
  tenant_id uuid [not null]
  encounter_id uuid [not null, ref: > er_encounters.id]
  test_id uuid [ref: > lab_tests_catalog.id]
  loinc_code varchar(20)
  test_name varchar(200) [not null]
  priority varchar(20) [not null, note: 'stat, urgent, routine']
  ordered_by uuid [not null, ref: > system_users.id]
  ordered_at timestamptz [not null, default: `now()`]
  collected_at timestamptz
  resulted_at timestamptz
  result_value varchar(100)
  result_unit varchar(30)
  reference_range varchar(50)
  abnormal_flag varchar(20) [note: 'normal, low, high, critical_low, critical_high']
  is_critical tinyint [not null, default: 0]
  callback_required tinyint [not null, default: 0]
  callback_acknowledged_by uuid [ref: > system_users.id]
  callback_acknowledged_at timestamptz
  
  Indexes {
    (tenant_id, encounter_id) [name: 'idx_er_lab_encounter']
    (tenant_id, is_critical, resulted_at) [name: 'idx_er_lab_critical']
  }
}

Table er_notes {
  id uuid [pk]
  tenant_id uuid [not null]
  encounter_id uuid [not null, ref: > er_encounters.id]
  note_type varchar(30) [not null, note: 'triage, nursing, md, procedure, consult, discharge']
  author_id uuid [not null, ref: > system_users.id]
  author_role varchar(30) [not null]
  content text [not null, note: 'encrypted column']
  cosigned_by uuid [ref: > system_users.id]
  cosigned_at timestamptz
  amend_history jsonb
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  
  Indexes {
    (tenant_id, encounter_id, note_type) [name: 'idx_er_notes_encounter_type']
  }
}

Table er_consultations {
  id uuid [pk]
  tenant_id uuid [not null]
  encounter_id uuid [not null, ref: > er_encounters.id]
  specialty varchar(50) [not null]
  consult_reason text
  urgent tinyint [not null, default: 0]
  requested_at timestamptz [not null, default: `now()`]
  requested_by uuid [not null, ref: > system_users.id]
  responded_at timestamptz
  consultant_id uuid [ref: > system_users.id]
  response_notes text [note: 'encrypted column']
  recommendation text [note: 'encrypted column']
  
  Indexes {
    (tenant_id, encounter_id) [name: 'idx_er_consults_encounter']
    (tenant_id, specialty, requested_at) [name: 'idx_er_consults_specialty_time']
  }
}

Table er_audit_log {
  id uuid [pk]
  tenant_id uuid [not null]
  encounter_id uuid [ref: > er_encounters.id]
  user_id uuid [ref: > system_users.id]
  action varchar(50) [not null]
  resource_type varchar(30)
  resource_id uuid
  before_state jsonb
  after_state jsonb
  input_hash varchar(64)
  output_hash varchar(64)
  prev_hash varchar(64) [not null, note: 'hash-chained']
  created_at timestamptz [not null, default: `now()`]
  
  Indexes {
    (tenant_id, encounter_id, created_at) [name: 'idx_er_audit_encounter_time']
    prev_hash [name: 'idx_er_audit_chain']
  }
}

// RLS policies (applied via separate migration)
Table er_rls_policy_note {
  Note: 'All tables: ENABLE + FORCE ROW LEVEL SECURITY; policy er_tenant_isolation USING (tenant_id = current_setting(app.tenant_id)::UUID)'
}
```

## Storage Estimates (per 1,000 encounters/day)
- `er_encounters`: ~5 MB/day = 1.8 GB/year
- `er_vitals`: ~50 MB/day = 18 GB/year (4-5 sets per encounter)
- `er_triage_decisions`: ~2 MB/day = 0.7 GB/year
- `er_red_flags`: ~3 MB/day = 1 GB/year
- `er_medications_admin`: ~10 MB/day = 3.6 GB/year
- `er_notes`: ~30 MB/day (text content) = 11 GB/year
- `er_audit_log`: ~20 MB/day = 7 GB/year
- **Total:** ~45 MB/day = ~16 GB/year per facility

## Backup Strategy
- Continuous WAL archiving (point-in-time recovery)
- Daily full backup (compressed + encrypted)
- Retention: 10 years (clinical)
- DR: cross-region replication, RPO <1h, RTO <4h

---
*Section 03.a of ER-001. Owner: SA + DSL. L4 validated.*
