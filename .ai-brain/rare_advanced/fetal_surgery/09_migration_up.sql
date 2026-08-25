-- UP Fetal Surgery
CREATE TABLE IF NOT EXISTS cx_fetal_surgery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cx_fetal_surgery_tenant ON cx_fetal_surgery(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cx_fetal_surgery_patient ON cx_fetal_surgery(patient_id);
ALTER TABLE cx_fetal_surgery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cx_fetal_surgery_tenant ON cx_fetal_surgery;
CREATE POLICY p_cx_fetal_surgery_tenant ON cx_fetal_surgery USING (tenant_id = current_setting('app.tenant_id')::uuid);
