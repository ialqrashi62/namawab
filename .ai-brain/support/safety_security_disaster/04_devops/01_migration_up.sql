-- UP Safety, Security & Disaster
CREATE TABLE IF NOT EXISTS incident_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_incident_records_tenant ON incident_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_incident_records_patient ON incident_records(patient_id);
ALTER TABLE incident_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_incident_records_tenant ON incident_records;
CREATE POLICY p_incident_records_tenant ON incident_records USING (tenant_id = current_setting('app.tenant_id')::uuid);
