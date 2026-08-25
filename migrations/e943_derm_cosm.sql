CREATE TABLE IF NOT EXISTS derm_cosm (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_derm_cosm_t ON derm_cosm(tenant_id, patient_id);
ALTER TABLE derm_cosm ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_cosm FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_derm_cosm_t ON derm_cosm;
CREATE POLICY p_derm_cosm_t ON derm_cosm USING (tenant_id = current_setting('app.tenant_id', true));