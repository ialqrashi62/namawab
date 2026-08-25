-- e377 TIER4_NEPH-101 CKD staging + progression
CREATE TABLE IF NOT EXISTS tier4_neph_101_ckd_stage (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  egfr NUMERIC NOT NULL,
  uacr_mg_g NUMERIC NOT NULL,
  g_stage TEXT NOT NULL,
  a_stage TEXT NOT NULL,
  risk TEXT NOT NULL,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_101_ckd_stage ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_101_ckd_stage FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_101_ckd_stage_t ON tier4_neph_101_ckd_stage;
CREATE POLICY tier4_neph_101_ckd_stage_t ON tier4_neph_101_ckd_stage
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_neph_101_ckd_progression (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  egfr_now NUMERIC NOT NULL,
  egfr_prior NUMERIC NOT NULL,
  slope_per_year NUMERIC,
  rapid_decline TEXT,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_101_ckd_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_101_ckd_progression FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_101_ckd_progression_t ON tier4_neph_101_ckd_progression;
CREATE POLICY tier4_neph_101_ckd_progression_t ON tier4_neph_101_ckd_progression
  USING (tenant_id = current_setting('app.tenant_id', true));