-- filepath: migrations/e999-g142_telehealth_ext.sql
CREATE TABLE IF NOT EXISTS tier122_telehealth_636 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  visit_id TEXT, reading_id TEXT, session_id TEXT, consult_id TEXT, dtx_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier122_telehealth_636 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier122_telehealth_636 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t122_th_636_isolation ON tier122_telehealth_636;
CREATE POLICY t122_th_636_isolation ON tier122_telehealth_636 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier122_devices_637 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  implant_id TEXT, alert_id TEXT, sync_id TEXT, pump_id TEXT, monitor_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier122_devices_637 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier122_devices_637 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t122_dev_637_isolation ON tier122_devices_637;
CREATE POLICY t122_dev_637_isolation ON tier122_devices_637 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier122_mhealth_638 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  app_id TEXT, msg_id TEXT, video_id TEXT, entry_id TEXT, sid TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier122_mhealth_638 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier122_mhealth_638 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t122_mh_638_isolation ON tier122_mhealth_638;
CREATE POLICY t122_mh_638_isolation ON tier122_mhealth_638 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier122_rpm_639 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  enroll_id TEXT, outlier_id TEXT, adh_id TEXT, path_id TEXT, sess_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier122_rpm_639 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier122_rpm_639 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t122_rpm_639_isolation ON tier122_rpm_639;
CREATE POLICY t122_rpm_639_isolation ON tier122_rpm_639 USING (tenant_id = current_setting('app.tenant_id', true));