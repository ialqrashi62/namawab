# URO-001 — ERD

```dbml
Project nama_uro_001 {
  database_type: 'PostgreSQL'
  Note: 'Urology ERD — Tier-1 dept.'
}

Table uro_001_visits {
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint [not null]
  provider_id uuid
  visit_type varchar
  chief_complaint text
  hpi text
  exam text
  ai_assessment_id bigint
  status varchar [default: 'open']
  created_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, patient_id); (tenant_id, created_at) }
}

Table uro_001_orders {
  id bigserial [pk]
  tenant_id uuid [not null]
  visit_id bigint [ref: > uro_001_visits.id]
  orders jsonb
  status varchar [default: 'active']
  created_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, visit_id) }
}

Table uro_001_results {
  id bigserial [pk]
  tenant_id uuid [not null]
  visit_id bigint [ref: > uro_001_visits.id]
  test_type varchar
  test_code varchar
  value_num numeric
  value_text text
  abnormal_flag varchar
  resulted_at timestamptz [not null]
  created_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, visit_id); (tenant_id, resulted_at DESC) }
}

Table uro_001_tasks_v2 {
  id bigserial [pk]
  tenant_id uuid [not null]
  visit_id bigint [ref: > uro_001_visits.id]
  title varchar
  priority varchar
  status varchar [default: 'open']
  due_at timestamptz
  created_at timestamptz [not null, default: 'now()']
  indexes { (tenant_id, status) }
}

Table uro_001_ai_assessments {
  id bigserial [pk]
  tenant_id uuid [not null]
  prompt_id varchar [not null]
  visit_id bigint [ref: > uro_001_visits.id]
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

All tables have `tenant_id`, RLS policy, FORCE_RLS = ON.

---

*Owner: SA — 2026-08-01 — AUTOPILOT*
