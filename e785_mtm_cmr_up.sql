CREATE TABLE IF NOT EXISTS mtm_cmr (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mtm_cmr_t ON mtm_cmr(tenant_id, patient_id);
ALTER TABLE mtm_cmr ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtm_cmr FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_mtm_cmr_t ON mtm_cmr;
CREATE POLICY p_mtm_cmr_t ON mtm_cmr USING (tenant_id = current_setting('app.tenant_id', true));
