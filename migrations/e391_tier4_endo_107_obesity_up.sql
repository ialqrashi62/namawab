-- e391 TIER4_ENDO-107 Obesity & Bariatric
CREATE TABLE IF NOT EXISTS tier4_endo_107_obesity_classify (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  bmi NUMERIC NOT NULL,
  comorbidity BOOLEAN,
  prior_lifestyle_failure BOOLEAN,
  classification TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_107_obesity_classify ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_107_obesity_classify FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_107_obesity_classify_t ON tier4_endo_107_obesity_classify;
CREATE POLICY tier4_endo_107_obesity_classify_t ON tier4_endo_107_obesity_classify
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_endo_107_obesity_bariatric (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  bmi NUMERIC NOT NULL,
  diabetes BOOLEAN,
  htn BOOLEAN,
  osa BOOLEAN,
  cardiovascular_disease BOOLEAN,
  candidate BOOLEAN,
  procedure TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_107_obesity_bariatric ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_107_obesity_bariatric FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_107_obesity_bariatric_t ON tier4_endo_107_obesity_bariatric;
CREATE POLICY tier4_endo_107_obesity_bariatric_t ON tier4_endo_107_obesity_bariatric
  USING (tenant_id = current_setting('app.tenant_id', true));