CREATE TABLE IF NOT EXISTS mtm_disease (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mtm_disease_t ON mtm_disease(tenant_id, patient_id);
ALTER TABLE mtm_disease ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtm_disease FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_mtm_disease_t ON mtm_disease;
CREATE POLICY p_mtm_disease_t ON mtm_disease USING (tenant_id = current_setting('app.tenant_id', true));
