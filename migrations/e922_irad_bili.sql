CREATE TABLE IF NOT EXISTS irad_bili (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_irad_bili_t ON irad_bili(tenant_id, patient_id);
ALTER TABLE irad_bili ENABLE ROW LEVEL SECURITY;
ALTER TABLE irad_bili FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_irad_bili_t ON irad_bili;
CREATE POLICY p_irad_bili_t ON irad_bili USING (tenant_id = current_setting('app.tenant_id', true));