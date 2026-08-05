# 18 — ERD Diagram (PULM-001)

> **Owner:** SA
> **Format:** DBML (dbdiagram.io)

```dbml
// .ai-brain/02_MODULES_NEW/TIER1_PULM-001/schema.dbml
// AppDB schema for Pulmonology department
// RLS + multi-tenant enforced
// Migrations: 22_migration_up.sql

Project nama_pulm {
  database_type: 'PostgreSQL'
  Note: 'Pulmonology ERD — Tier-1 dept. Multi-tenant via tenant_id + RLS.'
}

Table tenants {
  id uuid [pk]
  name_ar varchar [not null]
  name_en varchar [not null]
  facility_type varchar [not null]
  created_at timestamptz [not null, default: 'now()']
}

Table patients {
  id bigserial [pk]
  tenant_id uuid [not null, ref: > tenants.id]
  mrn varchar [not null]
  national_id_hash bytea [not null]
  name_ciphered bytea [not null] -- encrypted
  dob_encrypted bytea
  sex_encrypted bytea
  phone_ciphered bytea
  email_ciphered bytea
  extended_attrs jsonb
  created_at timestamptz [not null, default: 'now()']
  updated_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, mrn) [unique]; (tenant_id) }
}

Table pulmonary_visits {
  id bigserial [pk]
  tenant_id uuid [not null, ref: > tenants.id]
  patient_id bigint [not null, ref: > patients.id]
  provider_id uuid
  visit_type varchar -- initial, follow_up, urgent, telehealth
  chief_complaint text
  hpi text
  ros text
  exam text
  assessment text
  plan text
  ai_assessment_id bigint [ref: > ai_assessments.id]
  red_flag_fired boolean [default: false]
  status varchar [default: 'open']  -- open, in_progress, completed, signed
  locked_at timestamptz
  signed_at timestamptz
  signed_by uuid
  created_at timestamptz [not null]
  updated_at timestamptz [not null]
  indexes { (tenant_id, patient_id); (tenant_id, created_at) }
}

Table pulmonary_orders {
  id bigserial [pk]
  tenant_id uuid [not null]
  visit_id bigint [ref: > pulmonary_visits.id]
  order_set_id varchar -- e.g., OS:PULM:COPD_EXACERBATION
  orders jsonb -- structured: {type, drug/study, dose, route, timing}
  placed_by uuid
  placed_at timestamptz [not null, default: 'now()']
  status varchar [default: 'active']  -- active, completed, discontinued
  discontinued_reason text
  indexes { (tenant_id, visit_id); (tenant_id, status) }
}

Table pulmonary_results {
  id bigserial [pk]
  tenant_id uuid [not null]
  visit_id bigint [ref: > pulmonary_visits.id]
  test_type varchar -- PFT, ABG, imaging, lab
  test_code varchar
  test_name varchar
  value_num numeric
  value_unit varchar
  value_text text
  abnormal_flag varchar -- L, H, HH, LL, A
  reference_range text
  resulted_at timestamptz [not null]
  reviewed_at timestamptz
  reviewed_by uuid
  critical_value boolean [default: false]
  indexes { (tenant_id, visit_id, test_type); (tenant_id, resulted_at) }
}

Table pulmonary_care_pathways {
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint [not null, ref: > patients.id]
  pathway_id varchar [not null] -- PATH:PE_MASSIVE
  status varchar [default: 'active']  -- active, completed, abandoned
  started_at timestamptz [default: 'now()']
  ended_at timestamptz
  current_step varchar
  metadata jsonb
  indexes { (tenant_id, patient_id); (tenant_id, pathway_id, status) }
}

Table pulmonary_pathway_steps {
  id bigserial [pk]
  tenant_id uuid [not null]
  pathway_run_id bigint [ref: > pulmonary_care_pathways.id]
  step_id varchar [not null] -- node id
  entered_at timestamptz [not null]
  completed_at timestamptz
  outcome varchar -- success, skipped, failed
  provider_id uuid
  notes text
  audit_log_id bigint
  indexes { (pathway_run_id, step_id) }
}

Table sleep_studies {
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint [not null, ref: > patients.id]
  visit_id bigint [ref: > pulmonary_visits.id]
  study_type varchar -- diagnostic, titration, split-night
  study_date date
  ahi numeric
  odI numeric
  tsh_50p numeric
  study_pdf_path text
  interpretation text
  reviewed_at timestamptz
  reviewed_by uuid
  indexes { (tenant_id, patient_id, study_date) }
}

Table pulmonary_function_tests {
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint [not null, ref: > patients.id]
  visit_id bigint [ref: > pulmonary_visits.id]
  test_date date
  fev1 numeric
  fvc numeric
  fev1_fvc_ratio numeric
  dlco numeric
  bronchodilator_response boolean
  test_quality text
  comments text
  indexes { (tenant_id, patient_id, test_date) }
}

Table lung_biopsy_reports {
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint [not null, ref: > patients.id]
  procedure_id bigint
  specimen text
  histology_findings text
  diagnosis_ar text
  diagnosis_en text
  stage varchar -- TNM
  molecular jsonb -- EGFR, ALK, ROS1, PD-L1
  signed_at timestamptz
  signed_by uuid
  indexes { (tenant_id, patient_id) }
}

Table ai_assessments {
  id bigserial [pk]
  tenant_id uuid [not null]
  prompt_id varchar [not null] -- PROMPT:PULM-001:initial_assessment
  visit_id bigint [ref: > pulmonary_visits.id]
  prompt_version varchar [not null]
  model_target varchar
  model_used varchar
  input_redacted jsonb -- patient data hashed
  output jsonb
  citations jsonb
  red_flags jsonb
  drug_alerts jsonb
  confidence_score numeric
  override_status varchar -- pending, accepted, edited, rejected
  override_reason text
  override_by uuid
  provider_audit_id bigint
  created_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, visit_id); (prompt_id, created_at) }
}

Table pulmonary_tasks_v2 {
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint [ref: > patients.id]
  visit_id bigint [ref: > pulmonary_visits.id]
  pathway_run_id bigint [ref: > pulmonary_care_pathways.id]
  step_id varchar
  task_type varchar -- order, medication, consult, review
  title varchar
  description text
  priority varchar -- stat, urgent, routine
  assigned_to uuid
  assigned_role varchar
  due_at timestamptz
  started_at timestamptz
  completed_at timestamptz
  completion_reason text
  escalated boolean [default: false]
  audit_hash varchar
  created_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, status); (tenant_id, due_at) }
}

// Audit (shared)
Table audit_events {
  id bigserial [pk]
  tenant_id uuid [not null]
  user_id uuid
  action varchar
  resource_type varchar
  resource_id varchar
  before jsonb
  after jsonb
  ip inet
  ts timestamptz [default: 'now()']
  prev_hash varchar
  hash varchar
  indexes { (tenant_id, ts); (resource_type, resource_id) }
}

// RLS
Ref: pulmonary_visits.tenant_id > tenants.id
Ref: pulmonary_orders.tenant_id > tenants.id
Ref: pulmonary_results.tenant_id > tenants.id
Ref: pulmonary_care_pathways.tenant_id > tenants.id
Ref: pulmonary_pathway_steps.tenant_id > tenants.id
Ref: sleep_studies.tenant_id > tenants.id
Ref: pulmonary_function_tests.tenant_id > tenants.id
Ref: lung_biopsy_reports.tenant_id > tenants.id
Ref: ai_assessments.tenant_id > tenants.id
Ref: pulmonary_tasks_v2.tenant_id > tenants.id
Ref: audit_events.tenant_id > tenants.id
```

---

## Notes

- **RLS policy** applied per table in `22_migration_up.sql`
- **Encrypted columns** use `crypto_envelope.js` (DPAPI KEK)
- **JSONB** for orders (structured) and metadata (extensibility)
- **Indexes** optimize per-dept lookup + tenant scoping
- **AI assessment** foreign-keyed to visit; overridable
- **Audit** hash-chained per safety rail 10

---

*Owner: SA — version 1.0 — 2026-08-01*
