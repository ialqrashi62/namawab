-- UP Pulmonology & Respiratory
CREATE TABLE IF NOT EXISTS respiratory_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_respiratory_visits_tenant ON respiratory_visits(tenant_id);
CREATE INDEX IF NOT EXISTS idx_respiratory_visits_patient ON respiratory_visits(patient_id);
ALTER TABLE respiratory_visits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_respiratory_visits_tenant ON respiratory_visits;
CREATE POLICY p_respiratory_visits_tenant ON respiratory_visits USING (tenant_id = current_setting('app.tenant_id')::uuid);
