CREATE TABLE IF NOT EXISTS pmrehab_ped (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_pmrehab_ped_t ON pmrehab_ped(tenant_id, patient_id);
ALTER TABLE pmrehab_ped ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmrehab_ped FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pmrehab_ped_t ON pmrehab_ped;
CREATE POLICY p_pmrehab_ped_t ON pmrehab_ped USING (tenant_id = current_setting('app.tenant_id', true));