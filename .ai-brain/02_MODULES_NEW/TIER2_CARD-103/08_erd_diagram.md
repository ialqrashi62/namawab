# CARD-103 — ERD

```dbml
Project nama_card_103 {
  database_type: 'PostgreSQL'
  Note: 'Preventive Cardiology ERD — Tier-3 dept.'
}

Table card_103_visits {
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint
  provider_id uuid
  status varchar [default: 'open']
  chief_complaint text
  created_at timestamptz [default: 'now()']
  indexes { (tenant_id, patient_id); (tenant_id, created_at) }
}

Table card_103_orders {
  id bigserial [pk]
  tenant_id uuid [not null]
  visit_id bigint [ref: > card_103_visits.id]
  orders jsonb
  status varchar [default: 'active']
  created_at timestamptz [default: 'now()']
  indexes { (tenant_id, visit_id) }
}

Table card_103_results {
  id bigserial [pk]
  tenant_id uuid [not null]
  visit_id bigint [ref: > card_103_visits.id]
  test_name varchar
  value_text text
  resulted_at timestamptz [default: 'now()']
  indexes { (tenant_id, visit_id) }
}
```

All tables: RLS + FORCE RLS.

---

*Owner: SA — 2026-08-01*
