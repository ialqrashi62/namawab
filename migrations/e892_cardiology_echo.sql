CREATE TABLE IF NOT EXISTS cardiology_echo (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_cardiology_echo_t ON cardiology_echo(tenant_id, patient_id);
ALTER TABLE cardiology_echo ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardiology_echo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cardiology_echo_t ON cardiology_echo;
CREATE POLICY p_cardiology_echo_t ON cardiology_echo USING (tenant_id = current_setting('app.tenant_id', true));