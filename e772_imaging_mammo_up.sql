CREATE TABLE IF NOT EXISTS imaging_mammo (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_imaging_mammo_t ON imaging_mammo(tenant_id, patient_id);
ALTER TABLE imaging_mammo ENABLE ROW LEVEL SECURITY;
ALTER TABLE imaging_mammo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_imaging_mammo_t ON imaging_mammo;
CREATE POLICY p_imaging_mammo_t ON imaging_mammo USING (tenant_id = current_setting('app.tenant_id', true));
