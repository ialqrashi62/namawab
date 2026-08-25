-- filepath: migrations/e999-g143_specialty_ext.sql
CREATE TABLE IF NOT EXISTS tier123_dental_640 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  exam_id TEXT, rest_id TEXT, endo_id TEXT, perio_id TEXT, ortho_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier123_dental_640 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier123_dental_640 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t123_dental_640_isolation ON tier123_dental_640;
CREATE POLICY t123_dental_640_isolation ON tier123_dental_640 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier123_wound_641 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  wound_id TEXT, dressing_id TEXT, culture_id TEXT, debride_id TEXT, closure_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier123_wound_641 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier123_wound_641 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t123_wound_641_isolation ON tier123_wound_641;
CREATE POLICY t123_wound_641_isolation ON tier123_wound_641 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier123_skin_642 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  biopsy_id TEXT, derm_id TEXT, excise_id TEXT, patch_id TEXT, cryo_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier123_skin_642 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier123_skin_642 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t123_skin_642_isolation ON tier123_skin_642;
CREATE POLICY t123_skin_642_isolation ON tier123_skin_642 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier123_eye_643 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  va_id TEXT, tono_id TEXT, fundo_id TEXT, ret_id TEXT, oct_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier123_eye_643 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier123_eye_643 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t123_eye_643_isolation ON tier123_eye_643;
CREATE POLICY t123_eye_643_isolation ON tier123_eye_643 USING (tenant_id = current_setting('app.tenant_id', true));