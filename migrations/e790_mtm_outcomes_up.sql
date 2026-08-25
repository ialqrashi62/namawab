CREATE TABLE IF NOT EXISTS mtm_outcomes (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mtm_outcomes_t ON mtm_outcomes(tenant_id, patient_id);
ALTER TABLE mtm_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtm_outcomes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_mtm_outcomes_t ON mtm_outcomes;
CREATE POLICY p_mtm_outcomes_t ON mtm_outcomes USING (tenant_id = current_setting('app.tenant_id', true));
