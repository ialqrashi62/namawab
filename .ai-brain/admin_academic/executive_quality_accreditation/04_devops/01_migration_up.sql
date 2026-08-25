-- UP Executive Admin, Quality & Accreditation
CREATE TABLE IF NOT EXISTS quality_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_quality_records_tenant ON quality_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_quality_records_patient ON quality_records(patient_id);
ALTER TABLE quality_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_quality_records_tenant ON quality_records;
CREATE POLICY p_quality_records_tenant ON quality_records USING (tenant_id = current_setting('app.tenant_id')::uuid);
