-- filepath: e727_tier5_rare_ext_103_hem_up.sql
CREATE TABLE IF NOT EXISTS rare_hem (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  genotype TEXT NOT NULL,
  severity TEXT NOT NULL,
  planned_therapy TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rh_t ON rare_hem(tenant_id, patient_id);
ALTER TABLE rare_hem ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_hem FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_rh_t ON rare_hem;
CREATE POLICY p_rh_t ON rare_hem USING (tenant_id = current_setting('app.tenant_id', true));
