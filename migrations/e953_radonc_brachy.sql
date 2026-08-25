CREATE TABLE IF NOT EXISTS radonc_brachy (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_radonc_brachy_t ON radonc_brachy(tenant_id, patient_id);
ALTER TABLE radonc_brachy ENABLE ROW LEVEL SECURITY;
ALTER TABLE radonc_brachy FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_radonc_brachy_t ON radonc_brachy;
CREATE POLICY p_radonc_brachy_t ON radonc_brachy USING (tenant_id = current_setting('app.tenant_id', true));