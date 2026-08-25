CREATE TABLE IF NOT EXISTS endo_colon (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_endo_colon_t ON endo_colon(tenant_id, patient_id);
ALTER TABLE endo_colon ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_colon FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_endo_colon_t ON endo_colon;
CREATE POLICY p_endo_colon_t ON endo_colon USING (tenant_id = current_setting('app.tenant_id', true));