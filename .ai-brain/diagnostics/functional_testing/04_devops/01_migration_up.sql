-- UP Functional Diagnostics
CREATE TABLE IF NOT EXISTS func_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_func_tests_tenant ON func_tests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_func_tests_patient ON func_tests(patient_id);
ALTER TABLE func_tests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_func_tests_tenant ON func_tests;
CREATE POLICY p_func_tests_tenant ON func_tests USING (tenant_id = current_setting('app.tenant_id')::uuid);
