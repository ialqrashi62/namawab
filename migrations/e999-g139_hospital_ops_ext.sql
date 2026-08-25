-- filepath: migrations/e999-g139_hospital_ops_ext.sql
CREATE TABLE IF NOT EXISTS tier119_bed_management_624 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  assignment_id TEXT, transfer_id TEXT, cleaning_id TEXT, status_id TEXT, snapshot_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier119_bed_management_624 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier119_bed_management_624 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t119_bed_624_isolation ON tier119_bed_management_624;
CREATE POLICY t119_bed_624_isolation ON tier119_bed_management_624 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier119_transport_625 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  request_id TEXT, completion_id TEXT, courier_id TEXT, transport_id TEXT, dispatch_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier119_transport_625 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier119_transport_625 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t119_transport_625_isolation ON tier119_transport_625;
CREATE POLICY t119_transport_625_isolation ON tier119_transport_625 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier119_housekeeping_626 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  task_id TEXT, request_id TEXT, disposal_id TEXT, service_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier119_housekeeping_626 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier119_housekeeping_626 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t119_hk_626_isolation ON tier119_housekeeping_626;
CREATE POLICY t119_hk_626_isolation ON tier119_housekeeping_626 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier119_security_627 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  incident_id TEXT, visitor_id TEXT, log_id TEXT, alert_id TEXT, event_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier119_security_627 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier119_security_627 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t119_sec_627_isolation ON tier119_security_627;
CREATE POLICY t119_sec_627_isolation ON tier119_security_627 USING (tenant_id = current_setting('app.tenant_id', true));