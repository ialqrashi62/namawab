CREATE TABLE IF NOT EXISTS pharm_peds (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_pharm_peds_t ON pharm_peds(tenant_id, patient_id);
ALTER TABLE pharm_peds ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharm_peds FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pharm_peds_t ON pharm_peds;
CREATE POLICY p_pharm_peds_t ON pharm_peds USING (tenant_id = current_setting('app.tenant_id', true));