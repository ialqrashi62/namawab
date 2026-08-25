-- UP Pharmacogenomics
CREATE TABLE IF NOT EXISTS cx_pharmacogenomics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cx_pharmacogenomics_tenant ON cx_pharmacogenomics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cx_pharmacogenomics_patient ON cx_pharmacogenomics(patient_id);
ALTER TABLE cx_pharmacogenomics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cx_pharmacogenomics_tenant ON cx_pharmacogenomics;
CREATE POLICY p_cx_pharmacogenomics_tenant ON cx_pharmacogenomics USING (tenant_id = current_setting('app.tenant_id')::uuid);
