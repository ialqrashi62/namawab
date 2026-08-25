-- filepath: migrations/f002_portal_up.sql
-- TIER17_PORTAL_EXT 117-121 patient portal tables

CREATE TABLE IF NOT EXISTS tier17_portal_auth (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  mfa_method TEXT,
  session_id TEXT,
  event_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier17_portal_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier17_portal_auth FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier17_portal_auth_tenant ON tier17_portal_auth;
CREATE POLICY tier17_portal_auth_tenant ON tier17_portal_auth USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier17_portal_auth_tenant_idx ON tier17_portal_auth (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier17_portal_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  test_class TEXT,
  release_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier17_portal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier17_portal_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier17_portal_records_tenant ON tier17_portal_records;
CREATE POLICY tier17_portal_records_tenant ON tier17_portal_records USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier17_portal_records_tenant_idx ON tier17_portal_records (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier17_portal_appointments (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  specialty TEXT,
  visit_mode TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier17_portal_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier17_portal_appointments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier17_portal_appointments_tenant ON tier17_portal_appointments;
CREATE POLICY tier17_portal_appointments_tenant ON tier17_portal_appointments USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier17_portal_appointments_tenant_idx ON tier17_portal_appointments (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier17_portal_billing (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  balance_status TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier17_portal_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier17_portal_billing FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier17_portal_billing_tenant ON tier17_portal_billing;
CREATE POLICY tier17_portal_billing_tenant ON tier17_portal_billing USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier17_portal_billing_tenant_idx ON tier17_portal_billing (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier17_portal_messaging (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  thread_id TEXT,
  urgency TEXT,
  message_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier17_portal_messaging ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier17_portal_messaging FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier17_portal_messaging_tenant ON tier17_portal_messaging;
CREATE POLICY tier17_portal_messaging_tenant ON tier17_portal_messaging USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier17_portal_messaging_tenant_idx ON tier17_portal_messaging (tenant_id, thread_id, created_at DESC);