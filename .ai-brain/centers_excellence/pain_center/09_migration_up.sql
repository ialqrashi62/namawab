-- UP Chronic Pain Center
CREATE TABLE IF NOT EXISTS cx_pain_center (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cx_pain_center_tenant ON cx_pain_center(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cx_pain_center_patient ON cx_pain_center(patient_id);
ALTER TABLE cx_pain_center ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cx_pain_center_tenant ON cx_pain_center;
CREATE POLICY p_cx_pain_center_tenant ON cx_pain_center USING (tenant_id = current_setting('app.tenant_id')::uuid);
