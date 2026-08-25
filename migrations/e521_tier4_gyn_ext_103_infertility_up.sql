-- e521 TIER4_GYN_EXT-103 Infertility
CREATE TABLE IF NOT EXISTS tier4_gyn_ext_103_infert_workup (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  female_age NUMERIC NOT NULL,
  months_ttc NUMERIC NOT NULL,
  regular_cycles BOOLEAN,
  male_partner_evaluation BOOLEAN,
  prior_pregnancy BOOLEAN,
  action TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gyn_ext_103_infert_workup ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gyn_ext_103_infert_workup FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gyn_ext_103_infert_workup_t ON tier4_gyn_ext_103_infert_workup;
CREATE POLICY tier4_gyn_ext_103_infert_workup_t ON tier4_gyn_ext_103_infert_workup
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gyn_ext_103_infert_ovulation (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  cycle_length_days NUMERIC NOT NULL,
  mid_luteal_progesterone NUMERIC NOT NULL,
  bbt_biphasic BOOLEAN,
  interpretation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gyn_ext_103_infert_ovulation ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gyn_ext_103_infert_ovulation FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gyn_ext_103_infert_ovulation_t ON tier4_gyn_ext_103_infert_ovulation;
CREATE POLICY tier4_gyn_ext_103_infert_ovulation_t ON tier4_gyn_ext_103_infert_ovulation
  USING (tenant_id = current_setting('app.tenant_id', true));