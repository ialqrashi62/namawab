CREATE TABLE IF NOT EXISTS endo_ercp (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_endo_ercp_t ON endo_ercp(tenant_id, patient_id);
ALTER TABLE endo_ercp ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_ercp FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_endo_ercp_t ON endo_ercp;
CREATE POLICY p_endo_ercp_t ON endo_ercp USING (tenant_id = current_setting('app.tenant_id', true));