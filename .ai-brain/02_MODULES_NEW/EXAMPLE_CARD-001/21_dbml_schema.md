# 21 — DBML Schema (CARD-001)

> Owner: SA · Snippet: snippet:dbml-header · Tier 1

```dbml
Project nama_medical_cardiology_v1 {
  database_type: 'PostgreSQL'
  Note: 'Multi-tenant via tenant_id + RLS. PHI columns via crypto_envelope.'
}

// ============================================
// Reference: tenants (assumed existing)
// ============================================
Table tenants {
  id uuid [pk, default: `gen_random_uuid()`]
  name text [not null]
  nphies_payer_id text
  created_at timestamptz [not null, default: `now()`]
}

// ============================================
// Cardiology encounters
// ============================================
Table cardio_encounters {
  id uuid [pk, default: `gen_random_uuid()`]
  tenant_id uuid [not null, ref: > tenants.id]
  facility_id uuid
  patient_id uuid [not null]
  doctor_id uuid [not null]
  type text [not null, note: 'outpatient | inpatient | er | telehealth']
  status text [not null, note: 'open | closed | cancelled']
  started_at timestamptz [not null]
  ended_at timestamptz
  chief_complaint text
  hpi text
  pmh text [note: 'past medical history, encrypted']
  psh text [note: 'past surgical history']
  fh text [note: 'family history']
  sh text [note: 'social history']
  allergies text
  medications_current jsonb
  exam text
  diagnosis_primary text
  diagnosis_secondary jsonb
  plan text
  disposition text
  red_flags jsonb [note: 'array of red_flag ids']
  cds_rules_triggered jsonb
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  created_by uuid
  updated_by uuid

  Indexes {
    (tenant_id, patient_id, started_at DESC) [name: 'idx_cardio_enc_patient']
    (tenant_id, doctor_id, started_at DESC) [name: 'idx_cardio_enc_doctor']
    (tenant_id, facility_id, started_at DESC) [name: 'idx_cardio_enc_facility']
  }
  Note: 'RLS: FORCE ROW LEVEL SECURITY'
}

// ============================================
// ECG records (PHI vault references)
// ============================================
Table cardio_ecg {
  id uuid [pk, default: `gen_random_uuid()`]
  tenant_id uuid [not null, ref: > tenants.id]
  encounter_id uuid [not null, ref: > cardio_encounters.id]
  patient_id uuid [not null]
  interpreted_by uuid
  recorded_at timestamptz [not null]
  file_uri text [not null, note: 'path in phi_vault/']
  file_hash text [not null, note: 'sha256 of file, encrypted']
  rate int
  rhythm text
  pr_ms int
  qrs_ms int
  qtc_ms int
  axis_deg int
  st_per_lead jsonb
  q_per_lead jsonb
  t_per_lead jsonb
  impression text
  urgency text [note: 'routine | urgent | emergent | critical']
  red_flag bool [default: false]
  signed_by uuid
  signed_at timestamptz
  signoff_note text

  Indexes {
    (tenant_id, patient_id, recorded_at DESC) [name: 'idx_cardio_ecg_patient']
    (tenant_id, red_flag, signed_at) [name: 'idx_cardio_ecg_redflag_unsigned']
  }
  Note: 'RLS: FORCE ROW LEVEL SECURITY. PHI: file_uri in phi_vault, file_hash encrypted.'
}

// ============================================
// Echo reports
// ============================================
Table cardio_echo {
  id uuid [pk, default: `gen_random_uuid()`]
  tenant_id uuid [not null, ref: > tenants.id]
  encounter_id uuid [not null, ref: > cardio_encounters.id]
  patient_id uuid [not null]
  performed_at timestamptz [not null]
  interpreted_by uuid
  modality text [note: 'TTE | TEE | stress_echo']
  measurements jsonb [note: 'LV/RV/valves/diastolic/PASP']
  findings text
  impression text
  severity_summary jsonb [note: 'per valve: mild|moderate|severe']
  file_uri text [note: 'path in phi_vault/']
  red_flag bool [default: false]
  signed_by uuid
  signed_at timestamptz

  Indexes {
    (tenant_id, patient_id, performed_at DESC) [name: 'idx_cardio_echo_patient']
  }
  Note: 'RLS: FORCE ROW LEVEL SECURITY'
}

// ============================================
// Stress tests
// ============================================
Table cardio_stress {
  id uuid [pk, default: `gen_random_uuid()`]
  tenant_id uuid [not null, ref: > tenants.id]
  encounter_id uuid [not null, ref: > cardio_encounters.id]
  patient_id uuid [not null]
  performed_at timestamptz [not null]
  modality text [note: 'treadmill | pharmacologic | echo | nuclear']
  protocol text [note: 'Bruce | modified Bruce | dobutamine | adenosine']
  duration_min int
  max_hr int
  max_sbp int
  max_dbp int
  mets_achieved int
  symptoms text
  ecg_changes text
  impression text [note: 'positive | negative | equivocal | inconclusive']
  file_uri text
  signed_by uuid
  signed_at timestamptz

  Indexes {
    (tenant_id, patient_id, performed_at DESC) [name: 'idx_cardio_stress_patient']
  }
  Note: 'RLS: FORCE ROW LEVEL SECURITY'
}

// ============================================
// Holter / ambulatory ECG
// ============================================
Table cardio_holter {
  id uuid [pk, default: `gen_random_uuid()`]
  tenant_id uuid [not null, ref: > tenants.id]
  encounter_id uuid [not null, ref: > cardio_encounters.id]
  patient_id uuid [not null]
  start_at timestamptz [not null]
  end_at timestamptz [not null]
  duration_hours int
  device_serial text [note: 'encrypted']
  findings jsonb [note: 'rhythm, pauses, AF burden, SVT/VT episodes']
  file_uri text [note: 'path in phi_vault/']
  signed_by uuid
  signed_at timestamptz

  Indexes {
    (tenant_id, patient_id, start_at DESC) [name: 'idx_cardio_holter_patient']
  }
  Note: 'RLS: FORCE ROW LEVEL SECURITY'
}

// ============================================
// Cath lab reports
// ============================================
Table cardio_cath {
  id uuid [pk, default: `gen_random_uuid()`]
  tenant_id uuid [not null, ref: > tenants.id]
  encounter_id uuid [not null, ref: > cardio_encounters.id]
  patient_id uuid [not null]
  performed_by uuid [not null]
  procedure_at timestamptz [not null]
  procedure_type text [not null, note: 'diagnostic_cath | PCI | TAVR | MitraClip | Watchman | ASD_closure | PVI']
  access_site text [note: 'radial | femoral | brachial']
  findings jsonb [note: 'per-vessel stenosis, valve, anomaly']
  interventions jsonb [note: 'stents, balloons, devices']
  contrast_ml int
  fluoro_minutes int
  radiation_dose_mgy numeric
  complications text
  conclusion text
  icu_admission bool [default: false]
  nphies_bundle text [not null]
  amount_total numeric [not null]
  amount_currency text [default: 'SAR']
  status text [note: 'draft | signed | submitted | paid | denied']
  signed_by uuid
  signed_at timestamptz

  Indexes {
    (tenant_id, patient_id, procedure_at DESC) [name: 'idx_cardio_cath_patient']
    (tenant_id, encounter_id) [name: 'idx_cardio_cath_enc']
  }
  Note: 'RLS: FORCE ROW LEVEL SECURITY. MONEY: server-side via finance_engine'
}

// ============================================
// Device implants (PM, ICD, CRT, leadless)
// ============================================
Table cardio_devices {
  id uuid [pk, default: `gen_random_uuid()`]
  tenant_id uuid [not null, ref: > tenants.id]
  encounter_id uuid [not null, ref: > cardio_encounters.id]
  patient_id uuid [not null]
  implanted_by uuid [not null]
  device_type text [not null, note: 'PM_single | PM_dual | ICD_single | ICD_dual | CRT_P | CRT_D | leadless_PM | S_ICD']
  manufacturer text
  model text
  serial text [note: 'encrypted']
  implanted_at timestamptz [not null]
  leads jsonb [note: 'lead positions, types, thresholds']
  battery_estimated_years int
  icd_class text [note: 'IIb | III per SFDA']
  nphies_bundle text [not null]
  amount_total numeric [not null]
  amount_currency text [default: 'SAR']
  status text [note: 'active | explanted | replaced | lost_to_followup']
  explanted_at timestamptz
  explanted_by uuid
  explant_reason text

  Indexes {
    (tenant_id, patient_id, implanted_at DESC) [name: 'idx_cardio_dev_patient']
    (tenant_id, status, implanted_at DESC) [name: 'idx_cardio_dev_active']
  }
  Note: 'RLS: FORCE ROW LEVEL SECURITY. MONEY: server-side'
}

// ============================================
// Cardiac rehab plans
// ============================================
Table cardio_rehab {
  id uuid [pk, default: `gen_random_uuid()`]
  tenant_id uuid [not null, ref: > tenants.id]
  encounter_id uuid [not null, ref: > cardio_encounters.id]
  patient_id uuid [not null]
  indication text [note: 'post_MI | post_PCI | post_CABG | HF | stable_angina']
  sessions_planned int
  sessions_completed jsonb
  exercise_modality text [note: 'treadmill | bike | combined | home']
  risk_stratification text [note: 'low | moderate | high']
  start_date date
  end_date date
  status text [note: 'active | completed | discontinued']

  Indexes {
    (tenant_id, patient_id) [name: 'idx_cardio_rehab_patient']
  }
  Note: 'RLS: FORCE ROW LEVEL SECURITY'
}

// ============================================
// Cardiology Co-pilot queries
// ============================================
Table cardio_copilot_queries {
  id uuid [pk, default: `gen_random_uuid()`]
  tenant_id uuid [not null, ref: > tenants.id]
  user_id uuid [not null]
  encounter_id uuid [ref: > cardio_encounters.id]
  patient_id uuid
  question text [not null]
  intent text [note: 'clinical_q | rx | red_flag | admin']
  retrieval_chunks jsonb [note: 'array of {index, score, text, source}']
  answer_ar text
  answer_en text
  citations jsonb [note: 'array of {source, year, section, evidence_level}']
  evidence_level text [note: 'A | B | C']
  warnings jsonb
  cds_rules jsonb
  red_flag bool [default: false]
  trace_id text [note: 'langfuse trace_id']
  input_tokens int
  output_tokens int
  cost_usd numeric
  latency_ms int
  model text
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (tenant_id, encounter_id, created_at DESC) [name: 'idx_copilot_enc']
    (tenant_id, user_id, created_at DESC) [name: 'idx_copilot_user']
    (tenant_id, red_flag, created_at DESC) [name: 'idx_copilot_redflag']
  }
  Note: 'RLS: FORCE ROW LEVEL SECURITY. PHI: redacted before retrieval. Hash-chained to audit.'
}

// ============================================
// Red flag activations (CODE STEMI, etc.)
// ============================================
Table cardio_red_flag_activations {
  id uuid [pk, default: `gen_random_uuid()`]
  tenant_id uuid [not null, ref: > tenants.id]
  encounter_id uuid [not null, ref: > cardio_encounters.id]
  patient_id uuid [not null]
  activated_by uuid [not null]
  red_flag_id text [not null, note: 'STEMI | dissection | tamponade | PE | SCD | ...']
  severity text [not null, note: 'critical | urgent | warning']
  activated_at timestamptz [not null, default: `now()`]
  closed_at timestamptz
  sla_target_min int
  status text [note: 'active | resolved | cancelled']
  timeline jsonb [note: 'array of {event, at, actor}']
  notifications jsonb [note: 'array of {recipient, channel, sent_at, ack_at}']
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (tenant_id, status, activated_at DESC) [name: 'idx_redflag_active']
    (tenant_id, patient_id, activated_at DESC) [name: 'idx_redflag_patient']
  }
  Note: 'RLS: FORCE ROW LEVEL SECURITY. CRITICAL audit chain entry on activation.'
}

// ============================================
// NPHIES claims (for cardiology services)
// ============================================
Table cardio_nphies_claims {
  id uuid [pk, default: `gen_random_uuid()`]
  tenant_id uuid [not null, ref: > tenants.id]
  encounter_id uuid [not null, ref: > cardio_encounters.id]
  patient_id uuid [not null]
  nphies_claim_id text
  bundle text [not null, note: 'NPH-CARD-001 | NPH-CARD-PCI | NPH-CARD-EP | ...']
  amount numeric [not null]
  currency text [default: 'SAR']
  status text [note: 'queued | submitted | approved | denied | paid | partial']
  submitted_at timestamptz
  response_at timestamptz
  response_code text
  response_payload jsonb
  retry_count int [default: 0]
  next_retry_at timestamptz

  Indexes {
    (tenant_id, status, submitted_at DESC) [name: 'idx_nphies_status']
    (tenant_id, encounter_id) [name: 'idx_nphies_enc']
    nphies_claim_id [unique, name: 'uq_nphies_claim_id']
  }
  Note: 'RLS: FORCE ROW LEVEL SECURITY. MONEY: server-side only.'
}
```
