CREATE TABLE IF NOT EXISTS pmrehab_acute (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_pmrehab_acute_t ON pmrehab_acute(tenant_id, patient_id);
ALTER TABLE pmrehab_acute ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmrehab_acute FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pmrehab_acute_t ON pmrehab_acute;
CREATE POLICY p_pmrehab_acute_t ON pmrehab_acute USING (tenant_id = current_setting('app.tenant_id', true));