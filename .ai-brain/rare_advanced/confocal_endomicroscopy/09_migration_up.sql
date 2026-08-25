-- UP Confocal Laser Endomicroscopy
CREATE TABLE IF NOT EXISTS cx_confocal_endomicroscopy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cx_confocal_endomicroscopy_tenant ON cx_confocal_endomicroscopy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cx_confocal_endomicroscopy_patient ON cx_confocal_endomicroscopy(patient_id);
ALTER TABLE cx_confocal_endomicroscopy ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cx_confocal_endomicroscopy_tenant ON cx_confocal_endomicroscopy;
CREATE POLICY p_cx_confocal_endomicroscopy_tenant ON cx_confocal_endomicroscopy USING (tenant_id = current_setting('app.tenant_id')::uuid);
