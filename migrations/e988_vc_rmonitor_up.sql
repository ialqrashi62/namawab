-- filepath: migrations/e988_vc_rmonitor_up.sql
-- TIER6_VC_EXT-103 RPM vitals table
CREATE TABLE IF NOT EXISTS tier6_vc_rpm_vitals (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT NOT NULL,
  device_serial TEXT,
  vital_type TEXT,
  value DOUBLE PRECISION,
  source TEXT,
  timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier6_vc_rpm_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier6_vc_rpm_vitals FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier6_vc_rpm_vitals_tenant ON tier6_vc_rpm_vitals;
CREATE POLICY tier6_vc_rpm_vitals_tenant ON tier6_vc_rpm_vitals
  USING tenant_id::text = current_setting('app.tenant_id', true);
CREATE INDEX IF NOT EXISTS tier6_vc_rpm_vitals_tenant_idx ON tier6_vc_rpm_vitals (tenant_id, patient_id, created_at DESC);

-- TIER6_VC_EXT-103 RPM alerts table
CREATE TABLE IF NOT EXISTS tier6_vc_rpm_alerts (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT NOT NULL,
  vital_type TEXT,
  value DOUBLE PRECISION,
  severity TEXT,
  patient_aware BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier6_vc_rpm_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier6_vc_rpm_alerts FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier6_vc_rpm_alerts_tenant ON tier6_vc_rpm_alerts;
CREATE POLICY tier6_vc_rpm_alerts_tenant ON tier6_vc_rpm_alerts
  USING tenant_id::text = current_setting('app.tenant_id', true);
CREATE INDEX IF NOT EXISTS tier6_vc_rpm_alerts_tenant_idx ON tier6_vc_rpm_alerts (tenant_id, severity, created_at DESC);