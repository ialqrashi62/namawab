-- filepath: migrations/f000_icu_up.sql
-- TIER15_ICU_EXT 107-111 ICU tables

CREATE TABLE IF NOT EXISTS tier15_icu_vitals (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  score_type TEXT,
  score_total DOUBLE PRECISION,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier15_icu_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier15_icu_vitals FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier15_icu_vitals_tenant ON tier15_icu_vitals;
CREATE POLICY tier15_icu_vitals_tenant ON tier15_icu_vitals USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier15_icu_vitals_tenant_idx ON tier15_icu_vitals (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier15_icu_hemodynamics (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  shock_type TEXT,
  ci_l_min_m2 DOUBLE PRECISION,
  lactate_mmol_l DOUBLE PRECISION,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier15_icu_hemodynamics ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier15_icu_hemodynamics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier15_icu_hemodynamics_tenant ON tier15_icu_hemodynamics;
CREATE POLICY tier15_icu_hemodynamics_tenant ON tier15_icu_hemodynamics USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier15_icu_hemodynamics_tenant_idx ON tier15_icu_hemodynamics (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier15_icu_renal (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  aki_stage TEXT,
  rrt_mode TEXT,
  potassium_mmol_l DOUBLE PRECISION,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier15_icu_renal ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier15_icu_renal FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier15_icu_renal_tenant ON tier15_icu_renal;
CREATE POLICY tier15_icu_renal_tenant ON tier15_icu_renal USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier15_icu_renal_tenant_idx ON tier15_icu_renal (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier15_icu_nutrition (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  nutrition_route TEXT,
  bg_current_mg_dl DOUBLE PRECISION,
  braden_score DOUBLE PRECISION,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier15_icu_nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier15_icu_nutrition FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier15_icu_nutrition_tenant ON tier15_icu_nutrition;
CREATE POLICY tier15_icu_nutrition_tenant ON tier15_icu_nutrition USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier15_icu_nutrition_tenant_idx ON tier15_icu_nutrition (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier15_icu_admin (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  priority_tier TEXT,
  icu_unit TEXT,
  receiving_unit TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier15_icu_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier15_icu_admin FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier15_icu_admin_tenant ON tier15_icu_admin;
CREATE POLICY tier15_icu_admin_tenant ON tier15_icu_admin USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier15_icu_admin_tenant_idx ON tier15_icu_admin (tenant_id, patient_id, created_at DESC);