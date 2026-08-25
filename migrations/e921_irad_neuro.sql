CREATE TABLE IF NOT EXISTS irad_neuro (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_irad_neuro_t ON irad_neuro(tenant_id, patient_id);
ALTER TABLE irad_neuro ENABLE ROW LEVEL SECURITY;
ALTER TABLE irad_neuro FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_irad_neuro_t ON irad_neuro;
CREATE POLICY p_irad_neuro_t ON irad_neuro USING (tenant_id = current_setting('app.tenant_id', true));