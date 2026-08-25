-- e524 TIER4_GYN_EXT-106 Contraception
CREATE TABLE IF NOT EXISTS tier4_gyn_ext_106_contr_choice (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age NUMERIC NOT NULL,
  smoker BOOLEAN,
  hypertension BOOLEAN,
  diabetes BOOLEAN,
  breastfeeding BOOLEAN,
  wants_pregnancy_soon BOOLEAN,
  migraine BOOLEAN,
  bmi NUMERIC NOT NULL,
  recommendation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gyn_ext_106_contr_choice ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gyn_ext_106_contr_choice FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gyn_ext_106_contr_choice_t ON tier4_gyn_ext_106_contr_choice;
CREATE POLICY tier4_gyn_ext_106_contr_choice_t ON tier4_gyn_ext_106_contr_choice
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gyn_ext_106_contr_emergency (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  hours_since NUMERIC NOT NULL,
  weight_kg NUMERIC NOT NULL,
  within_iud_window BOOLEAN,
  therapy TEXT,
  weight_caveat TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gyn_ext_106_contr_emergency ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gyn_ext_106_contr_emergency FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gyn_ext_106_contr_emergency_t ON tier4_gyn_ext_106_contr_emergency;
CREATE POLICY tier4_gyn_ext_106_contr_emergency_t ON tier4_gyn_ext_106_contr_emergency
  USING (tenant_id = current_setting('app.tenant_id', true));