-- e789 tier5 mtm edu
CREATE TABLE IF NOT EXISTS mtm_edu (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_medu_t ON mtm_edu(tenant_id, patient_id);
ALTER TABLE mtm_edu ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtm_edu FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_medu_t ON mtm_edu;
CREATE POLICY p_medu_t ON mtm_edu USING (tenant_id = current_setting('app.tenant_id', true));
