-- e402 TIER4_ONC-102 Hematologic Malignancy
CREATE TABLE IF NOT EXISTS tier4_onc_102_hemmalig_lymphoma (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  subtype TEXT NOT NULL,
  stage TEXT,
  bulky BOOLEAN,
  b_symptoms BOOLEAN,
  ipi_score INT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_102_hemmalig_lymphoma ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_102_hemmalig_lymphoma FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_102_hemmalig_lymphoma_t ON tier4_onc_102_hemmalig_lymphoma;
CREATE POLICY tier4_onc_102_hemmalig_lymphoma_t ON tier4_onc_102_hemmalig_lymphoma
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_onc_102_hemmalig_mm (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  beta2_microglobulin NUMERIC,
  serum_albumin NUMERIC,
  high_risk_fish TEXT,
  crp NUMERIC,
  riss_stage TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_102_hemmalig_mm ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_102_hemmalig_mm FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_102_hemmalig_mm_t ON tier4_onc_102_hemmalig_mm;
CREATE POLICY tier4_onc_102_hemmalig_mm_t ON tier4_onc_102_hemmalig_mm
  USING (tenant_id = current_setting('app.tenant_id', true));