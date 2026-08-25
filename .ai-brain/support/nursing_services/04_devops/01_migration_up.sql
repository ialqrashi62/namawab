-- UP Nursing Services
CREATE TABLE IF NOT EXISTS nursing_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_nursing_records_tenant ON nursing_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nursing_records_patient ON nursing_records(patient_id);
ALTER TABLE nursing_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_nursing_records_tenant ON nursing_records;
CREATE POLICY p_nursing_records_tenant ON nursing_records USING (tenant_id = current_setting('app.tenant_id')::uuid);
