CREATE TABLE IF NOT EXISTS pharm_steward (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_pharm_steward_t ON pharm_steward(tenant_id, patient_id);
ALTER TABLE pharm_steward ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharm_steward FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pharm_steward_t ON pharm_steward;
CREATE POLICY p_pharm_steward_t ON pharm_steward USING (tenant_id = current_setting('app.tenant_id', true));