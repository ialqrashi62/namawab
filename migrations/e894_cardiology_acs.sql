CREATE TABLE IF NOT EXISTS cardiology_acs (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_cardiology_acs_t ON cardiology_acs(tenant_id, patient_id);
ALTER TABLE cardiology_acs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardiology_acs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cardiology_acs_t ON cardiology_acs;
CREATE POLICY p_cardiology_acs_t ON cardiology_acs USING (tenant_id = current_setting('app.tenant_id', true));