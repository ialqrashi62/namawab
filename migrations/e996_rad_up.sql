-- filepath: migrations/e996_rad_up.sql
-- TIER11_RAD_EXT 101-106 advanced radiology tables

CREATE TABLE IF NOT EXISTS tier11_rad_nuclear (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  study_id TEXT,
  radiopharmaceutical TEXT,
  dose_mbq DOUBLE PRECISION,
  dose_status TEXT,
  uptake_pattern TEXT,
  interp_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier11_rad_nuclear ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier11_rad_nuclear FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier11_rad_nuclear_tenant ON tier11_rad_nuclear;
CREATE POLICY tier11_rad_nuclear_tenant ON tier11_rad_nuclear USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier11_rad_nuclear_tenant_idx ON tier11_rad_nuclear (tenant_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier11_rad_interventional (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  procedure_id TEXT,
  indication TEXT,
  urgency TEXT,
  procedure_status TEXT,
  embo_status TEXT,
  complications TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier11_rad_interventional ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier11_rad_interventional FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier11_rad_interventional_tenant ON tier11_rad_interventional;
CREATE POLICY tier11_rad_interventional_tenant ON tier11_rad_interventional USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier11_rad_interventional_tenant_idx ON tier11_rad_interventional (tenant_id, indication, created_at DESC);

CREATE TABLE IF NOT EXISTS tier11_rad_ai (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  study_id TEXT,
  modality TEXT,
  ai_priority TEXT,
  triage_status TEXT,
  detection_category TEXT,
  worklist_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier11_rad_ai ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier11_rad_ai FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier11_rad_ai_tenant ON tier11_rad_ai;
CREATE POLICY tier11_rad_ai_tenant ON tier11_rad_ai USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier11_rad_ai_tenant_idx ON tier11_rad_ai (tenant_id, modality, created_at DESC);

CREATE TABLE IF NOT EXISTS tier11_rad_ultrasound (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  study_id TEXT,
  exam_type TEXT,
  interpretation TEXT,
  fast_status TEXT,
  ob_growth TEXT,
  msk_pathology TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier11_rad_ultrasound ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier11_rad_ultrasound FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier11_rad_ultrasound_tenant ON tier11_rad_ultrasound;
CREATE POLICY tier11_rad_ultrasound_tenant ON tier11_rad_ultrasound USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier11_rad_ultrasound_tenant_idx ON tier11_rad_ultrasound (tenant_id, exam_type, created_at DESC);

CREATE TABLE IF NOT EXISTS tier11_rad_dose (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  study_id TEXT,
  dlp_mgy_cm DOUBLE PRECISION,
  dose_status TEXT,
  ratio DOUBLE PRECISION,
  cumulative_dose_msv DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier11_rad_dose ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier11_rad_dose FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier11_rad_dose_tenant ON tier11_rad_dose;
CREATE POLICY tier11_rad_dose_tenant ON tier11_rad_dose USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier11_rad_dose_tenant_idx ON tier11_rad_dose (tenant_id, dose_status, created_at DESC);

CREATE TABLE IF NOT EXISTS tier11_rad_reporting (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  study_id TEXT,
  report_id TEXT,
  birads TEXT,
  lungrads TEXT,
  tirads TEXT,
  critical_category TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier11_rad_reporting ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier11_rad_reporting FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier11_rad_reporting_tenant ON tier11_rad_reporting;
CREATE POLICY tier11_rad_reporting_tenant ON tier11_rad_reporting USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier11_rad_reporting_tenant_idx ON tier11_rad_reporting (tenant_id, created_at DESC);