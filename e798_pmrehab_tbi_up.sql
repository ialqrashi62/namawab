CREATE TABLE IF NOT EXISTS pmrehab_tbi (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pmrehab_tbi_t ON pmrehab_tbi(tenant_id, patient_id);
ALTER TABLE pmrehab_tbi ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmrehab_tbi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pmrehab_tbi_t ON pmrehab_tbi;
CREATE POLICY p_pmrehab_tbi_t ON pmrehab_tbi USING (tenant_id = current_setting('app.tenant_id', true));
