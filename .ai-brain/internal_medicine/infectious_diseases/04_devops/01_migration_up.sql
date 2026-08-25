-- UP Infectious Diseases
CREATE TABLE IF NOT EXISTS id_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_id_cases_tenant ON id_cases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_id_cases_patient ON id_cases(patient_id);
ALTER TABLE id_cases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_id_cases_tenant ON id_cases;
CREATE POLICY p_id_cases_tenant ON id_cases USING (tenant_id = current_setting('app.tenant_id')::uuid);
