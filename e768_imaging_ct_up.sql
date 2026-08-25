CREATE TABLE IF NOT EXISTS imaging_ct (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_imaging_ct_t ON imaging_ct(tenant_id, patient_id);
ALTER TABLE imaging_ct ENABLE ROW LEVEL SECURITY;
ALTER TABLE imaging_ct FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_imaging_ct_t ON imaging_ct;
CREATE POLICY p_imaging_ct_t ON imaging_ct USING (tenant_id = current_setting('app.tenant_id', true));
