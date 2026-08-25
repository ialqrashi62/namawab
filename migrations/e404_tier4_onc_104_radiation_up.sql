-- e404 TIER4_ONC-104 Radiation
CREATE TABLE IF NOT EXISTS tier4_onc_104_radiation_plan (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  intent TEXT NOT NULL,
  site TEXT NOT NULL,
  total_dose_gy NUMERIC NOT NULL,
  fractions INT NOT NULL,
  fraction_size_gy NUMERIC,
  technique TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_104_radiation_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_104_radiation_plan FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_104_radiation_plan_t ON tier4_onc_104_radiation_plan;
CREATE POLICY tier4_onc_104_radiation_plan_t ON tier4_onc_104_radiation_plan
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_onc_104_radiation_toxicity (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  site TEXT,
  ctcae_grade TEXT,
  organ TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_104_radiation_toxicity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_104_radiation_toxicity FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_104_radiation_toxicity_t ON tier4_onc_104_radiation_toxicity;
CREATE POLICY tier4_onc_104_radiation_toxicity_t ON tier4_onc_104_radiation_toxicity
  USING (tenant_id = current_setting('app.tenant_id', true));