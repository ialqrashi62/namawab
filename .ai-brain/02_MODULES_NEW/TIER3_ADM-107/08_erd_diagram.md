# ADM-107 — ERD

```dbml
Project nama_adm_107 {
  database_type: 'PostgreSQL'
  Note: 'Procurement ERD — Tier-3 dept.'
}

Table adm_107_visits {
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint
  provider_id uuid
  status varchar [default: 'open']
  chief_complaint text
  created_at timestamptz [default: 'now()']
  indexes { (tenant_id, patient_id); (tenant_id, created_at) }
}

Table adm_107_orders {
  id bigserial [pk]
  tenant_id uuid [not null]
  visit_id bigint [ref: > adm_107_visits.id]
  orders jsonb
  status varchar [default: 'active']
  created_at timestamptz [default: 'now()']
  indexes { (tenant_id, visit_id) }
}

Table adm_107_results {
  id bigserial [pk]
  tenant_id uuid [not null]
  visit_id bigint [ref: > adm_107_visits.id]
  test_name varchar
  value_text text
  resulted_at timestamptz [default: 'now()']
  indexes { (tenant_id, visit_id) }
}
```

All tables: RLS + FORCE RLS.

---

*Owner: SA — 2026-08-01*
