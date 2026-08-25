CREATE TABLE IF NOT EXISTS pmrehab_lymph (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pmrehab_lymph_t ON pmrehab_lymph(tenant_id, patient_id);
ALTER TABLE pmrehab_lymph ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmrehab_lymph FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pmrehab_lymph_t ON pmrehab_lymph;
CREATE POLICY p_pmrehab_lymph_t ON pmrehab_lymph USING (tenant_id = current_setting('app.tenant_id', true));
