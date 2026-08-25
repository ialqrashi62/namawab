CREATE TABLE IF NOT EXISTS imaging_mri (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_imaging_mri_t ON imaging_mri(tenant_id, patient_id);
ALTER TABLE imaging_mri ENABLE ROW LEVEL SECURITY;
ALTER TABLE imaging_mri FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_imaging_mri_t ON imaging_mri;
CREATE POLICY p_imaging_mri_t ON imaging_mri USING (tenant_id = current_setting('app.tenant_id', true));
