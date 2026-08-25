CREATE TABLE IF NOT EXISTS derm_acne (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_derm_acne_t ON derm_acne(tenant_id, patient_id);
ALTER TABLE derm_acne ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_acne FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_derm_acne_t ON derm_acne;
CREATE POLICY p_derm_acne_t ON derm_acne USING (tenant_id = current_setting('app.tenant_id', true));