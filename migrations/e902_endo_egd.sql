CREATE TABLE IF NOT EXISTS endo_egd (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_endo_egd_t ON endo_egd(tenant_id, patient_id);
ALTER TABLE endo_egd ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_egd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_endo_egd_t ON endo_egd;
CREATE POLICY p_endo_egd_t ON endo_egd USING (tenant_id = current_setting('app.tenant_id', true));