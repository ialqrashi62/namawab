-- filepath: e737_tier5_pain_ext_101_chronic_up.sql
-- TIER5_PAIN_EXT-101: Chronic pain tables
CREATE TABLE IF NOT EXISTS pain_plan (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  pain_diagnosis TEXT NOT NULL,
  intensity_nrs INT NOT NULL,
  plan_json TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pp_t ON pain_plan(tenant_id, patient_id);
ALTER TABLE pain_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_plan FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pp_t ON pain_plan;
CREATE POLICY p_pp_t ON pain_plan USING (tenant_id = current_setting('app.tenant_id', true));
