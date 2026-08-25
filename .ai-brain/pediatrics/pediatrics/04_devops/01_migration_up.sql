-- UP Pediatrics & Neonatology
CREATE TABLE IF NOT EXISTS peds_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_peds_visits_tenant ON peds_visits(tenant_id);
CREATE INDEX IF NOT EXISTS idx_peds_visits_patient ON peds_visits(patient_id);
ALTER TABLE peds_visits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_peds_visits_tenant ON peds_visits;
CREATE POLICY p_peds_visits_tenant ON peds_visits USING (tenant_id = current_setting('app.tenant_id')::uuid);
