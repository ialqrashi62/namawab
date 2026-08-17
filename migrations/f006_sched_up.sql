-- filepath: migrations/f006_sched_up.sql
-- TIER21_SCHED_EXT 137-142 scheduling tables

CREATE TABLE IF NOT EXISTS tier21_sched_provider (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  provider_id TEXT,
  panel_status TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier21_sched_provider ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier21_sched_provider FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier21_sched_provider_tenant ON tier21_sched_provider;
CREATE POLICY tier21_sched_provider_tenant ON tier21_sched_provider USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier21_sched_provider_tenant_idx ON tier21_sched_provider (tenant_id, provider_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier21_sched_call (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  call_id TEXT,
  provider_id TEXT,
  call_type TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier21_sched_call ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier21_sched_call FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier21_sched_call_tenant ON tier21_sched_call;
CREATE POLICY tier21_sched_call_tenant ON tier21_sched_call USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier21_sched_call_tenant_idx ON tier21_sched_call (tenant_id, call_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier21_sched_template (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  template_id TEXT,
  recurrence TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier21_sched_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier21_sched_template FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier21_sched_template_tenant ON tier21_sched_template;
CREATE POLICY tier21_sched_template_tenant ON tier21_sched_template USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier21_sched_template_tenant_idx ON tier21_sched_template (tenant_id, template_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier21_sched_waitlist (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  waitlist_id TEXT,
  patient_id TEXT,
  urgency TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier21_sched_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier21_sched_waitlist FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier21_sched_waitlist_tenant ON tier21_sched_waitlist;
CREATE POLICY tier21_sched_waitlist_tenant ON tier21_sched_waitlist USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier21_sched_waitlist_tenant_idx ON tier21_sched_waitlist (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier21_sched_appointment (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  appointment_id TEXT,
  provider_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier21_sched_appointment ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier21_sched_appointment FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier21_sched_appointment_tenant ON tier21_sched_appointment;
CREATE POLICY tier21_sched_appointment_tenant ON tier21_sched_appointment USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier21_sched_appointment_tenant_idx ON tier21_sched_appointment (tenant_id, appointment_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier21_sched_staff (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  staff_id TEXT,
  unit_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier21_sched_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier21_sched_staff FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier21_sched_staff_tenant ON tier21_sched_staff;
CREATE POLICY tier21_sched_staff_tenant ON tier21_sched_staff USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier21_sched_staff_tenant_idx ON tier21_sched_staff (tenant_id, staff_id, created_at DESC);