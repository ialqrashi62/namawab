CREATE TABLE IF NOT EXISTS endo_uro (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_endo_uro_t ON endo_uro(tenant_id, patient_id);
ALTER TABLE endo_uro ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_uro FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_endo_uro_t ON endo_uro;
CREATE POLICY p_endo_uro_t ON endo_uro USING (tenant_id = current_setting('app.tenant_id', true));