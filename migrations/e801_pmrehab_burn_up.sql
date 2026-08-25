CREATE TABLE IF NOT EXISTS pmrehab_burn (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pmrehab_burn_t ON pmrehab_burn(tenant_id, patient_id);
ALTER TABLE pmrehab_burn ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmrehab_burn FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pmrehab_burn_t ON pmrehab_burn;
CREATE POLICY p_pmrehab_burn_t ON pmrehab_burn USING (tenant_id = current_setting('app.tenant_id', true));
