-- Migration: TIER3_CARD-304_ROBOTIC (UP) — Non-destructive
-- Robotic Cardiac Surgery tables

CREATE TABLE IF NOT EXISTS robotic_cv_cases (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER NOT NULL,
  diagnosis VARCHAR(100),
  procedure_type VARCHAR(50),
  device VARCHAR(50),
  sts_score NUMERIC(5,2),
  euroscore_ii NUMERIC(5,2),
  ef_pct INTEGER CHECK (ef_pct BETWEEN 0 AND 100),
  status VARCHAR(20) DEFAULT 'pending',
  created_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rcv_cases_tenant ON robotic_cv_cases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rcv_cases_patient ON robotic_cv_cases(patient_id);
CREATE INDEX IF NOT EXISTS idx_rcv_cases_proc ON robotic_cv_cases(procedure_type, status);
CREATE INDEX IF NOT EXISTS idx_rcv_cases_ef ON robotic_cv_cases(ef_pct);
ALTER TABLE robotic_cv_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE robotic_cv_cases FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rcv_cases_tenant_isolation ON robotic_cv_cases;
CREATE POLICY rcv_cases_tenant_isolation ON robotic_cv_cases
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS robotic_cv_procedures (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  case_id INTEGER REFERENCES robotic_cv_cases(id),
  patient_id INTEGER NOT NULL,
  procedure_date DATE,
  console_hours NUMERIC(4,1),
  bypass_time_min INTEGER,
  cross_clamp_min INTEGER,
  conversion_to_open BOOLEAN DEFAULT FALSE,
  success BOOLEAN DEFAULT TRUE,
  complications TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rcv_proc_tenant ON robotic_cv_procedures(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rcv_proc_patient ON robotic_cv_procedures(patient_id);
CREATE INDEX IF NOT EXISTS idx_rcv_proc_date ON robotic_cv_procedures(procedure_date DESC);
ALTER TABLE robotic_cv_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE robotic_cv_procedures FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rcv_proc_tenant_isolation ON robotic_cv_procedures;
CREATE POLICY rcv_proc_tenant_isolation ON robotic_cv_procedures
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS robotic_cv_followups (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  case_id INTEGER REFERENCES robotic_cv_cases(id),
  patient_id INTEGER NOT NULL,
  followup_date DATE,
  followup_type VARCHAR(50) DEFAULT 'routine',
  echo_findings TEXT,
  valve_function VARCHAR(50),
  complications TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rcv_fup_tenant ON robotic_cv_followups(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rcv_fup_patient ON robotic_cv_followups(patient_id);
CREATE INDEX IF NOT EXISTS idx_rcv_fup_date ON robotic_cv_followups(followup_date DESC);
ALTER TABLE robotic_cv_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE robotic_cv_followups FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rcv_fup_tenant_isolation ON robotic_cv_followups;
CREATE POLICY rcv_fup_tenant_isolation ON robotic_cv_followups
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS robotic_cv_devices (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  device_serial VARCHAR(100) NOT NULL,
  device_type VARCHAR(50),
  manufacture_date DATE,
  lot_number VARCHAR(50),
  sfda_registration VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  procedures_count INTEGER DEFAULT 0,
  last_maintenance DATE,
  next_maintenance DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rcv_dev_tenant ON robotic_cv_devices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rcv_dev_type ON robotic_cv_devices(device_type);
CREATE INDEX IF NOT EXISTS idx_rcv_dev_status ON robotic_cv_devices(status);
ALTER TABLE robotic_cv_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE robotic_cv_devices FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rcv_dev_tenant_isolation ON robotic_cv_devices;
CREATE POLICY rcv_dev_tenant_isolation ON robotic_cv_devices
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));
