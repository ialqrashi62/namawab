CREATE TABLE IF NOT EXISTS derm_gen (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_derm_gen_t ON derm_gen(tenant_id, patient_id);
ALTER TABLE derm_gen ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_gen FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_derm_gen_t ON derm_gen;
CREATE POLICY p_derm_gen_t ON derm_gen USING (tenant_id = current_setting('app.tenant_id', true));