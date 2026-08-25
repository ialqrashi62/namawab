-- e511 TIER4_CHRONIC-105 Comorbidity
CREATE TABLE IF NOT EXISTS tier4_chronic_105_cci (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age NUMERIC NOT NULL,
  mi BOOLEAN,
  chf BOOLEAN,
  cva BOOLEAN,
  dm_uncomplicated BOOLEAN,
  dm_endorgan BOOLEAN,
  copd BOOLEAN,
  ckd BOOLEAN,
  liver_mild BOOLEAN,
  liver_severe BOOLEAN,
  peptic_ulcer BOOLEAN,
  cancer_local BOOLEAN,
  cancer_metastatic BOOLEAN,
  hiv BOOLEAN,
  score NUMERIC,
  mortality TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_chronic_105_cci ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_chronic_105_cci FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_chronic_105_cci_t ON tier4_chronic_105_cci;
CREATE POLICY tier4_chronic_105_cci_t ON tier4_chronic_105_cci
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_chronic_105_polypharm (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  medication_count NUMERIC NOT NULL,
  high_risk_meds NUMERIC NOT NULL,
  anticholinergic_count NUMERIC NOT NULL,
  risk TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_chronic_105_polypharm ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_chronic_105_polypharm FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_chronic_105_polypharm_t ON tier4_chronic_105_polypharm;
CREATE POLICY tier4_chronic_105_polypharm_t ON tier4_chronic_105_polypharm
  USING (tenant_id = current_setting('app.tenant_id', true));