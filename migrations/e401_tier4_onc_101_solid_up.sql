-- e401 TIER4_ONC-101 Solid Tumor
CREATE TABLE IF NOT EXISTS tier4_onc_101_solid_tnm (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  t INT NOT NULL,
  n INT NOT NULL,
  m INT NOT NULL,
  stage TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_101_solid_tnm ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_101_solid_tnm FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_101_solid_tnm_t ON tier4_onc_101_solid_tnm;
CREATE POLICY tier4_onc_101_solid_tnm_t ON tier4_onc_101_solid_tnm
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_onc_101_solid_ecog (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ecog INT NOT NULL,
  fit_for_full_chemo BOOLEAN,
  therapy_recommendation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_101_solid_ecog ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_101_solid_ecog FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_101_solid_ecog_t ON tier4_onc_101_solid_ecog;
CREATE POLICY tier4_onc_101_solid_ecog_t ON tier4_onc_101_solid_ecog
  USING (tenant_id = current_setting('app.tenant_id', true));