CREATE TABLE IF NOT EXISTS derm_inf (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_derm_inf_t ON derm_inf(tenant_id, patient_id);
ALTER TABLE derm_inf ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_inf FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_derm_inf_t ON derm_inf;
CREATE POLICY p_derm_inf_t ON derm_inf USING (tenant_id = current_setting('app.tenant_id', true));