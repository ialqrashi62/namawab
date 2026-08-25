CREATE TABLE IF NOT EXISTS derm_melan (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_derm_melan_t ON derm_melan(tenant_id, patient_id);
ALTER TABLE derm_melan ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_melan FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_derm_melan_t ON derm_melan;
CREATE POLICY p_derm_melan_t ON derm_melan USING (tenant_id = current_setting('app.tenant_id', true));