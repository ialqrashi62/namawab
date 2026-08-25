-- e522 TIER4_GYN_EXT-104 Menopause
CREATE TABLE IF NOT EXISTS tier4_gyn_ext_104_meno_stage (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age NUMERIC NOT NULL,
  last_period_months NUMERIC NOT NULL,
  fsh NUMERIC NOT NULL,
  hot_flash BOOLEAN,
  night_sweat BOOLEAN,
  vaginal_dryness BOOLEAN,
  stage TEXT,
  symptoms NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gyn_ext_104_meno_stage ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gyn_ext_104_meno_stage FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gyn_ext_104_meno_stage_t ON tier4_gyn_ext_104_meno_stage;
CREATE POLICY tier4_gyn_ext_104_meno_stage_t ON tier4_gyn_ext_104_meno_stage
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gyn_ext_104_meno_ht (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age NUMERIC NOT NULL,
  years_since_menopause NUMERIC NOT NULL,
  breast_cancer_history BOOLEAN,
  vte_history BOOLEAN,
  chd_history BOOLEAN,
  stroke_history BOOLEAN,
  liver_disease BOOLEAN,
  recommendation TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gyn_ext_104_meno_ht ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gyn_ext_104_meno_ht FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gyn_ext_104_meno_ht_t ON tier4_gyn_ext_104_meno_ht;
CREATE POLICY tier4_gyn_ext_104_meno_ht_t ON tier4_gyn_ext_104_meno_ht
  USING (tenant_id = current_setting('app.tenant_id', true));