// Chronic Pain Center — DBML (tenant-isolated)
Table cx_pain_center {
  id uuid [pk, default:`gen_random_uuid()`]
  tenant_id uuid [not null, ref: > tenants.id]
  patient_id uuid [ref: > patients.id]
  payload jsonb [not null]
  status varchar(24) [default:'active']
  created_by uuid
  created_at timestamptz [default:`now()`]
  updated_at timestamptz
  indexes { tenant_id, patient_id, (tenant_id,status) }
}
Table cx_pain_center_audit {
  id bigserial [pk]
  row_id uuid [not null]
  action varchar(16)
  actor uuid
  diff jsonb
  created_at timestamptz [default:`now()`]
}
-- RLS: ALTER TABLE cx_pain_center ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY tenant_isolation ON cx_pain_center USING (tenant_id = current_setting('app.tenant_id')::uuid);
