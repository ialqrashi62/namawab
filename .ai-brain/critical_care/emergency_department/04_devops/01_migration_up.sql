-- UP Emergency Department
CREATE TABLE IF NOT EXISTS er_encounters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_er_encounters_tenant ON er_encounters(tenant_id);
CREATE INDEX IF NOT EXISTS idx_er_encounters_patient ON er_encounters(patient_id);
ALTER TABLE er_encounters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_er_encounters_tenant ON er_encounters;
CREATE POLICY p_er_encounters_tenant ON er_encounters USING (tenant_id = current_setting('app.tenant_id')::uuid);
