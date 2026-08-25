CREATE TABLE IF NOT EXISTS oph_retina (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_oph_retina_t ON oph_retina(tenant_id, patient_id);
ALTER TABLE oph_retina ENABLE ROW LEVEL SECURITY;
ALTER TABLE oph_retina FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_oph_retina_t ON oph_retina;
CREATE POLICY p_oph_retina_t ON oph_retina USING (tenant_id = current_setting('app.tenant_id', true));