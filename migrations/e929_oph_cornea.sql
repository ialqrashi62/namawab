CREATE TABLE IF NOT EXISTS oph_cornea (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_oph_cornea_t ON oph_cornea(tenant_id, patient_id);
ALTER TABLE oph_cornea ENABLE ROW LEVEL SECURITY;
ALTER TABLE oph_cornea FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_oph_cornea_t ON oph_cornea;
CREATE POLICY p_oph_cornea_t ON oph_cornea USING (tenant_id = current_setting('app.tenant_id', true));