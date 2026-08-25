CREATE TABLE IF NOT EXISTS radonc_seeds (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_radonc_seeds_t ON radonc_seeds(tenant_id, patient_id);
ALTER TABLE radonc_seeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE radonc_seeds FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_radonc_seeds_t ON radonc_seeds;
CREATE POLICY p_radonc_seeds_t ON radonc_seeds USING (tenant_id = current_setting('app.tenant_id', true));