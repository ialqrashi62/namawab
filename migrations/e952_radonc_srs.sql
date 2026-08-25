CREATE TABLE IF NOT EXISTS radonc_srs (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_radonc_srs_t ON radonc_srs(tenant_id, patient_id);
ALTER TABLE radonc_srs ENABLE ROW LEVEL SECURITY;
ALTER TABLE radonc_srs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_radonc_srs_t ON radonc_srs;
CREATE POLICY p_radonc_srs_t ON radonc_srs USING (tenant_id = current_setting('app.tenant_id', true));