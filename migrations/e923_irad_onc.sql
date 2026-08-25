CREATE TABLE IF NOT EXISTS irad_onc (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_irad_onc_t ON irad_onc(tenant_id, patient_id);
ALTER TABLE irad_onc ENABLE ROW LEVEL SECURITY;
ALTER TABLE irad_onc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_irad_onc_t ON irad_onc;
CREATE POLICY p_irad_onc_t ON irad_onc USING (tenant_id = current_setting('app.tenant_id', true));