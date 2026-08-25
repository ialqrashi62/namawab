-- filepath: migrations/e999-g144_imaging_ext.sql
CREATE TABLE IF NOT EXISTS tier124_rad_advanced_644 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  study_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier124_rad_advanced_644 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier124_rad_advanced_644 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t124_rad_644_isolation ON tier124_rad_advanced_644;
CREATE POLICY t124_rad_644_isolation ON tier124_rad_advanced_644 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier124_cardio_imaging_645 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  echo_id TEXT, stress_id TEXT, cmri_id TEXT, holter_id TEXT, event_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier124_cardio_imaging_645 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier124_cardio_imaging_645 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t124_ci_645_isolation ON tier124_cardio_imaging_645;
CREATE POLICY t124_ci_645_isolation ON tier124_cardio_imaging_645 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier124_endoscopy_646 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  scope_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier124_endoscopy_646 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier124_endoscopy_646 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t124_end_646_isolation ON tier124_endoscopy_646;
CREATE POLICY t124_end_646_isolation ON tier124_endoscopy_646 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier124_ultrasound_647 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  us_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier124_ultrasound_647 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier124_ultrasound_647 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t124_us_647_isolation ON tier124_ultrasound_647;
CREATE POLICY t124_us_647_isolation ON tier124_ultrasound_647 USING (tenant_id = current_setting('app.tenant_id', true));