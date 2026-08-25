-- filepath: e731_tier5_derm2_ext_101_mohs_up.sql
-- TIER5_DERM2_EXT-101: Mohs + dermatopathology staging
CREATE TABLE IF NOT EXISTS mohs_case (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  lesion_diagnosis TEXT NOT NULL,
  stages_count INT NOT NULL,
  last_stage_negative BOOLEAN NOT NULL,
  defect_size_cm2 NUMERIC NOT NULL,
  closed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mohs_t ON mohs_case(tenant_id, lesion_diagnosis);
ALTER TABLE mohs_case ENABLE ROW LEVEL SECURITY;
ALTER TABLE mohs_case FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_mohs_t ON mohs_case;
CREATE POLICY p_mohs_t ON mohs_case USING (tenant_id = current_setting('app.tenant_id', true));
