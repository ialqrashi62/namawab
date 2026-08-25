-- UP Nuclear Medicine Therapy
CREATE TABLE IF NOT EXISTS cx_nuclear_therapy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cx_nuclear_therapy_tenant ON cx_nuclear_therapy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cx_nuclear_therapy_patient ON cx_nuclear_therapy(patient_id);
ALTER TABLE cx_nuclear_therapy ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cx_nuclear_therapy_tenant ON cx_nuclear_therapy;
CREATE POLICY p_cx_nuclear_therapy_tenant ON cx_nuclear_therapy USING (tenant_id = current_setting('app.tenant_id')::uuid);
