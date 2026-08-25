-- e143 P0-10 Telemedicine UP
-- Tables: tm_sessions, tm_vitals_stream, tm_consults

CREATE TABLE IF NOT EXISTS tm_sessions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  session_id VARCHAR(60) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  provider_id INTEGER NOT NULL,
  session_type VARCHAR(30) DEFAULT 'video',
  encryption VARCHAR(50) DEFAULT 'DTLS-SRTP_AES256',
  jwt_token VARCHAR(80),
  ice_servers JSONB,
  expires_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  recording_consent BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tm_sessions_tenant ON tm_sessions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tm_sessions_patient ON tm_sessions(patient_id);
ALTER TABLE tm_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tm_sessions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tm_sessions_tenant_isolation ON tm_sessions;
CREATE POLICY tm_sessions_tenant_isolation ON tm_sessions
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tm_vitals_stream (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  session_id VARCHAR(60) NOT NULL,
  patient_id INTEGER NOT NULL,
  heart_rate INTEGER,
  systolic_bp INTEGER,
  diastolic_bp INTEGER,
  spo2 INTEGER,
  respiratory_rate INTEGER,
  temperature_c NUMERIC(4,2),
  alerts TEXT[],
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tm_vitals_stream ENABLE ROW LEVEL SECURITY;
ALTER TABLE tm_vitals_stream FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tm_vitals_tenant_isolation ON tm_vitals_stream;
CREATE POLICY tm_vitals_tenant_isolation ON tm_vitals_stream
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tm_consults (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  request_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  provider_id INTEGER,
  chief_complaint TEXT,
  urgency VARCHAR(20),
  attachments TEXT[],
  expected_response_hours INTEGER,
  responded_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'queued',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tm_consults ENABLE ROW LEVEL SECURITY;
ALTER TABLE tm_consults FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tm_consults_tenant_isolation ON tm_consults;
CREATE POLICY tm_consults_tenant_isolation ON tm_consults
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));