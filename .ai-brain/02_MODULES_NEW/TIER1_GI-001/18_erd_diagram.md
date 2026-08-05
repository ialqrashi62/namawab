# GI-001 — ERD

```dbml
Project nama_gi {
  database_type: 'PostgreSQL'
  Note: 'Gastroenterology ERD — Tier-1 dept.'
}

// Reuse patients + pulmonary_visits from base (assumed)

Table gi_visits {
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint [not null, ref: > patients.id]
  provider_id uuid
  visit_type varchar -- initial, follow_up, urgent, telehealth
  chief_complaint text
  hpi text
  exam text
  ai_assessment_id bigint
  red_flag_fired boolean [default: false]
  status varchar [default: 'open']
  created_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, patient_id); (tenant_id, created_at) }
}

Table gi_procedures {
  id bigserial [pk]
  tenant_id uuid [not null]
  visit_id bigint [ref: > gi_visits.id]
  procedure_type varchar -- EGD, colonoscopy, ERCP, EUS, capsule, sigmoidoscopy
  scheduled_at timestamptz
  performed_at timestamptz
  endoscopist_id uuid
  findings text
  intervention_performed text
  asa_score int
  complications text
  duration_min int
  cpt_code varchar
  created_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, visit_id); (tenant_id, procedure_type, performed_at) }
}

Table gi_biopsy_results {
  id bigserial [pk]
  tenant_id uuid [not null]
  procedure_id bigint [ref: > gi_procedures.id]
  specimen_site varchar -- gastric antrum, cecum, terminal ileum, etc.
  histopathology text
  dysplasia varchar  -- none, low-grade, high-grade, carcinoma
  helico_pylori varchar  -- positive, negative, not tested
  margins varchar  -- clear, involved, indeterminate
  signed_at timestamptz
  signed_by uuid
  created_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, procedure_id) }
}

Table gi_pathology_results {
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint [not null]
  procedure_id bigint [ref: > gi_procedures.id]
  report text
  dx_ar text
  stage varchar -- for cancer (TNM)
  molecular jsonb -- MSI, BRAF, KRAS, HER2 for CRC
  signed_at timestamptz
  created_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, patient_id) }
}

Table gi_labs {
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint [not null]
  visit_id bigint [ref: > gi_visits.id]
  test_name varchar
  test_code varchar
  value_num numeric
  value_text text
  unit varchar
  abnormal_flag varchar
  resulted_at timestamptz [not null, default: 'now()']
  created_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, patient_id, test_name, resulted_at DESC) }
}

Table ibd_assessments {
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint [not null]
  visit_id bigint [ref: > gi_visits.id]
  ibd_type varchar  -- 'CD', 'UC', 'IBD-U'
  montreal_age varchar  -- A1, A2, A3
  montreal_location varchar  -- L1, L2, L3, L4 (CD); E1-E3 (UC)
  montreal_behavior varchar  -- B1, B2, B3 (CD only)
  mayo_score int  -- UC
  sccai int  -- UC
  cDAI int  -- CD
  hbi int  -- CD
  calprotectin numeric
  crp numeric
  endoscopy_severity varchar  -- mild, moderate, severe
  assessment_date date [not null]
  created_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, patient_id, assessment_date DESC) }
}

Table gi_orders {
  id bigserial [pk]
  tenant_id uuid [not null]
  visit_id bigint [ref: > gi_visits.id]
  orders jsonb
  status varchar [default: 'active']
  created_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, visit_id); (tenant_id, status) }
}

Table gi_tasks_v2 {
  id bigserial [pk]
  tenant_id uuid [not null]
  visit_id bigint [ref: > gi_visits.id]
  title varchar
  priority varchar
  status varchar [default: 'open']
  due_at timestamptz
  assigned_role varchar
  created_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, status); (tenant_id, due_at) }
}

Table gi_ai_assessments {
  id bigserial [pk]
  tenant_id uuid [not null]
  prompt_id varchar [not null]
  visit_id bigint [ref: > gi_visits.id]
  prompt_version varchar [not null]
  model_used varchar
  output jsonb
  citations jsonb
  confidence numeric
  override_status varchar [default: 'pending']
  created_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, visit_id) }
}
```

### Indices + RLS

All tenant-scoped tables:
- `tenant_id` indexed
- `FORCE RLS = ON`
- Policy: `tenant_id::text = current_setting('app.tenant_id', true)::text`

See `p1_003_gi_001_up.sql` for full DDL.

---

*Owner: SA — 2026-08-01*
