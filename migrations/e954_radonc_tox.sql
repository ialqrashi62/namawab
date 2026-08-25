CREATE TABLE IF NOT EXISTS radonc_tox (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_radonc_tox_t ON radonc_tox(tenant_id, patient_id);
ALTER TABLE radonc_tox ENABLE ROW LEVEL SECURITY;
ALTER TABLE radonc_tox FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_radonc_tox_t ON radonc_tox;
CREATE POLICY p_radonc_tox_t ON radonc_tox USING (tenant_id = current_setting('app.tenant_id', true));