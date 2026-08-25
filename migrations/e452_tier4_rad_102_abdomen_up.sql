-- e452 TIER4_RAD-102 Abdomen Imaging
CREATE TABLE IF NOT EXISTS tier4_rad_102_abd_liver (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  size_cm NUMERIC NOT NULL,
  cirrhotic BOOLEAN,
  arterial_enhance BOOLEAN,
  washout BOOLEAN,
  threshold_growth BOOLEAN,
  li_rads TEXT,
  recommend TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rad_102_abd_liver ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_102_abd_liver FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rad_102_abd_liver_t ON tier4_rad_102_abd_liver;
CREATE POLICY tier4_rad_102_abd_liver_t ON tier4_rad_102_abd_liver
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rad_102_abd_pancyst (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  size_cm NUMERIC NOT NULL,
  main_duct_mm NUMERIC NOT NULL,
  mural_nodule BOOLEAN,
  high_risk_stigmata BOOLEAN,
  worrisome TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rad_102_abd_pancyst ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_102_abd_pancyst FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rad_102_abd_pancyst_t ON tier4_rad_102_abd_pancyst;
CREATE POLICY tier4_rad_102_abd_pancyst_t ON tier4_rad_102_abd_pancyst
  USING (tenant_id = current_setting('app.tenant_id', true));