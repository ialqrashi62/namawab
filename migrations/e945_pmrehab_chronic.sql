CREATE TABLE IF NOT EXISTS pmrehab_chronic (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_pmrehab_chronic_t ON pmrehab_chronic(tenant_id, patient_id);
ALTER TABLE pmrehab_chronic ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmrehab_chronic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pmrehab_chronic_t ON pmrehab_chronic;
CREATE POLICY p_pmrehab_chronic_t ON pmrehab_chronic USING (tenant_id = current_setting('app.tenant_id', true));