-- UP Cardiothoracic & Vascular Surgery
CREATE TABLE IF NOT EXISTS ctsx_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ctsx_cases_tenant ON ctsx_cases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ctsx_cases_patient ON ctsx_cases(patient_id);
ALTER TABLE ctsx_cases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ctsx_cases_tenant ON ctsx_cases;
CREATE POLICY p_ctsx_cases_tenant ON ctsx_cases USING (tenant_id = current_setting('app.tenant_id')::uuid);
