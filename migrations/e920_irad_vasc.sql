CREATE TABLE IF NOT EXISTS irad_vasc (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_irad_vasc_t ON irad_vasc(tenant_id, patient_id);
ALTER TABLE irad_vasc ENABLE ROW LEVEL SECURITY;
ALTER TABLE irad_vasc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_irad_vasc_t ON irad_vasc;
CREATE POLICY p_irad_vasc_t ON irad_vasc USING (tenant_id = current_setting('app.tenant_id', true));