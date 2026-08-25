-- e520 TIER4_GYN_EXT-102 Antenatal
CREATE TABLE IF NOT EXISTS tier4_gyn_ext_102_anta_trim (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  gestational_weeks NUMERIC NOT NULL,
  bp_systolic NUMERIC NOT NULL,
  weight_kg NUMERIC NOT NULL,
  pre_pregnancy_weight NUMERIC NOT NULL,
  weight_gain NUMERIC,
  trimester TEXT,
  recommendation TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gyn_ext_102_anta_trim ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gyn_ext_102_anta_trim FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gyn_ext_102_anta_trim_t ON tier4_gyn_ext_102_anta_trim;
CREATE POLICY tier4_gyn_ext_102_anta_trim_t ON tier4_gyn_ext_102_anta_trim
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gyn_ext_102_anta_pec (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  gestational_weeks NUMERIC NOT NULL,
  bp_systolic NUMERIC NOT NULL,
  bp_diastolic NUMERIC NOT NULL,
  proteinuria BOOLEAN,
  severe_features BOOLEAN,
  diagnosis TEXT,
  action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gyn_ext_102_anta_pec ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gyn_ext_102_anta_pec FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gyn_ext_102_anta_pec_t ON tier4_gyn_ext_102_anta_pec;
CREATE POLICY tier4_gyn_ext_102_anta_pec_t ON tier4_gyn_ext_102_anta_pec
  USING (tenant_id = current_setting('app.tenant_id', true));