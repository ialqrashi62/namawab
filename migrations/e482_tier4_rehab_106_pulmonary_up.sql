-- e482 TIER4_REHAB-106 Pulmonary
CREATE TABLE IF NOT EXISTS tier4_rehab_106_pulm_6mwt (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  distance_m NUMERIC NOT NULL,
  age NUMERIC NOT NULL,
  is_female BOOLEAN,
  baseline_predicted_m NUMERIC,
  pct_predicted NUMERIC,
  severity TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rehab_106_pulm_6mwt ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rehab_106_pulm_6mwt FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rehab_106_pulm_6mwt_t ON tier4_rehab_106_pulm_6mwt;
CREATE POLICY tier4_rehab_106_pulm_6mwt_t ON tier4_rehab_106_pulm_6mwt
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rehab_106_pulm_cpx (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  vo2_max NUMERIC NOT NULL,
  age NUMERIC NOT NULL,
  is_female BOOLEAN,
  predicted NUMERIC,
  pct NUMERIC,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rehab_106_pulm_cpx ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rehab_106_pulm_cpx FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rehab_106_pulm_cpx_t ON tier4_rehab_106_pulm_cpx;
CREATE POLICY tier4_rehab_106_pulm_cpx_t ON tier4_rehab_106_pulm_cpx
  USING (tenant_id = current_setting('app.tenant_id', true));