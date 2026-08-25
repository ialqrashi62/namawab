CREATE TABLE IF NOT EXISTS irad_uro (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_irad_uro_t ON irad_uro(tenant_id, patient_id);
ALTER TABLE irad_uro ENABLE ROW LEVEL SECURITY;
ALTER TABLE irad_uro FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_irad_uro_t ON irad_uro;
CREATE POLICY p_irad_uro_t ON irad_uro USING (tenant_id = current_setting('app.tenant_id', true));