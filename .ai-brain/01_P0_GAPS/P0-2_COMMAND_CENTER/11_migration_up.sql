-- Migration: P0-2_COMMAND_CENTER (UP) — Non-destructive
-- Hospital Command Center tables

CREATE TABLE IF NOT EXISTS cc_beds (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  bed_number VARCHAR(20) NOT NULL,
  ward VARCHAR(50),
  type VARCHAR(30),
  status VARCHAR(20) DEFAULT 'available',
  patient_id INTEGER,
  admitted_at TIMESTAMPTZ,
  expected_discharge DATE,
  cleaning_started_at TIMESTAMPTZ,
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_beds_tenant ON cc_beds(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cc_beds_status ON cc_beds(status);
CREATE INDEX IF NOT EXISTS idx_cc_beds_type ON cc_beds(type);
CREATE INDEX IF NOT EXISTS idx_cc_beds_ward ON cc_beds(ward);
ALTER TABLE cc_beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_beds FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cc_beds_tenant_isolation ON cc_beds;
CREATE POLICY cc_beds_tenant_isolation ON cc_beds
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS cc_ed_visits (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  arrival_time TIMESTAMPTZ,
  triage_level INTEGER,
  triage_time TIMESTAMPTZ,
  doctor_seen_time TIMESTAMPTZ,
  disposition VARCHAR(50),
  disposition_time TIMESTAMPTZ,
  wait_minutes INTEGER,
  status VARCHAR(20) DEFAULT 'waiting',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_ed_tenant ON cc_ed_visits(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cc_ed_status ON cc_ed_visits(status);
CREATE INDEX IF NOT EXISTS idx_cc_ed_triage ON cc_ed_visits(triage_level);
ALTER TABLE cc_ed_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_ed_visits FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cc_ed_tenant_isolation ON cc_ed_visits;
CREATE POLICY cc_ed_tenant_isolation ON cc_ed_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS cc_or_schedule (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  case_id VARCHAR(50),
  procedure_name VARCHAR(200),
  surgeon_id INTEGER,
  or_room VARCHAR(20),
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'scheduled',
  urgency VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_or_tenant ON cc_or_schedule(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cc_or_status ON cc_or_schedule(status);
CREATE INDEX IF NOT EXISTS idx_cc_or_start ON cc_or_schedule(scheduled_start);
ALTER TABLE cc_or_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_or_schedule FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cc_or_tenant_isolation ON cc_or_schedule;
CREATE POLICY cc_or_tenant_isolation ON cc_or_schedule
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS cc_mci_events (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  event_type VARCHAR(50),
  mci_level INTEGER,
  victims INTEGER,
  severity VARCHAR(20),
  activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  activated_by INTEGER,
  notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_cc_mci_tenant ON cc_mci_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cc_mci_level ON cc_mci_events(mci_level);
CREATE INDEX IF NOT EXISTS idx_cc_mci_activated ON cc_mci_events(activated_at DESC);
ALTER TABLE cc_mci_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_mci_events FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cc_mci_tenant_isolation ON cc_mci_events;
CREATE POLICY cc_mci_tenant_isolation ON cc_mci_events
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS cc_equipment (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  device_serial VARCHAR(100) NOT NULL,
  type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'available',
  ward VARCHAR(50),
  last_maintenance DATE,
  next_maintenance DATE,
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_eq_tenant ON cc_equipment(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cc_eq_status ON cc_equipment(status);
CREATE INDEX IF NOT EXISTS idx_cc_eq_type ON cc_equipment(type);
ALTER TABLE cc_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_equipment FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cc_eq_tenant_isolation ON cc_equipment;
CREATE POLICY cc_eq_tenant_isolation ON cc_equipment
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));
