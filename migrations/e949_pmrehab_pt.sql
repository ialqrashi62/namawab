CREATE TABLE IF NOT EXISTS pmrehab_pt (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_pmrehab_pt_t ON pmrehab_pt(tenant_id, patient_id);
ALTER TABLE pmrehab_pt ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmrehab_pt FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pmrehab_pt_t ON pmrehab_pt;
CREATE POLICY p_pmrehab_pt_t ON pmrehab_pt USING (tenant_id = current_setting('app.tenant_id', true));