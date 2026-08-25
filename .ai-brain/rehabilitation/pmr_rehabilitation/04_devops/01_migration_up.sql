-- UP PM&R Rehabilitation
CREATE TABLE IF NOT EXISTS rehab_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rehab_sessions_tenant ON rehab_sessions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rehab_sessions_patient ON rehab_sessions(patient_id);
ALTER TABLE rehab_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_rehab_sessions_tenant ON rehab_sessions;
CREATE POLICY p_rehab_sessions_tenant ON rehab_sessions USING (tenant_id = current_setting('app.tenant_id')::uuid);
