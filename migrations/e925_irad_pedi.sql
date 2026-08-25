CREATE TABLE IF NOT EXISTS irad_pedi (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_irad_pedi_t ON irad_pedi(tenant_id, patient_id);
ALTER TABLE irad_pedi ENABLE ROW LEVEL SECURITY;
ALTER TABLE irad_pedi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_irad_pedi_t ON irad_pedi;
CREATE POLICY p_irad_pedi_t ON irad_pedi USING (tenant_id = current_setting('app.tenant_id', true));