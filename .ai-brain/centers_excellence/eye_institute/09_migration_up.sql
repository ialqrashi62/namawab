-- UP Eye Institute
CREATE TABLE IF NOT EXISTS cx_eye_institute (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cx_eye_institute_tenant ON cx_eye_institute(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cx_eye_institute_patient ON cx_eye_institute(patient_id);
ALTER TABLE cx_eye_institute ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cx_eye_institute_tenant ON cx_eye_institute;
CREATE POLICY p_cx_eye_institute_tenant ON cx_eye_institute USING (tenant_id = current_setting('app.tenant_id')::uuid);
