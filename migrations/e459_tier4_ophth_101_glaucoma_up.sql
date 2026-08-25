-- e459 TIER4_OPHTH-101 Glaucoma
CREATE TABLE IF NOT EXISTS tier4_ophth_101_glaucoma_risk (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  iop NUMERIC NOT NULL,
  cct NUMERIC NOT NULL,
  cdr NUMERIC NOT NULL,
  family_history BOOLEAN,
  age INT NOT NULL,
  cct_adjusted_iop NUMERIC,
  risk TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_101_glaucoma_risk ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_101_glaucoma_risk FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_101_glaucoma_risk_t ON tier4_ophth_101_glaucoma_risk;
CREATE POLICY tier4_ophth_101_glaucoma_risk_t ON tier4_ophth_101_glaucoma_risk
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_ophth_101_glaucoma_angleclosure (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  eye_pain BOOLEAN,
  halos BOOLEAN,
  nausea_vomiting BOOLEAN,
  mid_dilated_pupil BOOLEAN,
  steamy_cornea BOOLEAN,
  iop NUMERIC NOT NULL,
  action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_101_glaucoma_angleclosure ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_101_glaucoma_angleclosure FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_101_glaucoma_angleclosure_t ON tier4_ophth_101_glaucoma_angleclosure;
CREATE POLICY tier4_ophth_101_glaucoma_angleclosure_t ON tier4_ophth_101_glaucoma_angleclosure
  USING (tenant_id = current_setting('app.tenant_id', true));