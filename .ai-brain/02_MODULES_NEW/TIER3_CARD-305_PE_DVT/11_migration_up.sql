-- Migration: TIER3_CARD-305_PE_DVT (UP) — Non-destructive
-- PE/DVT tables

CREATE TABLE IF NOT EXISTS pe_dvt_cases (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER NOT NULL,
  diagnosis VARCHAR(50),
  severity VARCHAR(20),
  location VARCHAR(100),
  sbp INTEGER,
  hr INTEGER,
  spo2 INTEGER,
  rv_dysfunction BOOLEAN DEFAULT FALSE,
  biomarker_positive BOOLEAN DEFAULT FALSE,
  pert_activated BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active',
  created_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pe_cases_tenant ON pe_dvt_cases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pe_cases_patient ON pe_dvt_cases(patient_id);
CREATE INDEX IF NOT EXISTS idx_pe_cases_severity ON pe_dvt_cases(severity);
CREATE INDEX IF NOT EXISTS idx_pe_cases_status ON pe_dvt_cases(status);
ALTER TABLE pe_dvt_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE pe_dvt_cases FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pe_cases_tenant_isolation ON pe_dvt_cases;
CREATE POLICY pe_cases_tenant_isolation ON pe_dvt_cases
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pe_dvt_treatments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  case_id INTEGER REFERENCES pe_dvt_cases(id),
  patient_id INTEGER NOT NULL,
  treatment_type VARCHAR(50),
  drug_name VARCHAR(50),
  dose_mg NUMERIC(6,2),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  complications TEXT,
  success BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pe_tx_tenant ON pe_dvt_treatments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pe_tx_patient ON pe_dvt_treatments(patient_id);
CREATE INDEX IF NOT EXISTS idx_pe_tx_case ON pe_dvt_treatments(case_id);
CREATE INDEX IF NOT EXISTS idx_pe_tx_started ON pe_dvt_treatments(started_at DESC);
ALTER TABLE pe_dvt_treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pe_dvt_treatments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pe_tx_tenant_isolation ON pe_dvt_treatments;
CREATE POLICY pe_tx_tenant_isolation ON pe_dvt_treatments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pe_dvt_followups (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  case_id INTEGER REFERENCES pe_dvt_cases(id),
  patient_id INTEGER NOT NULL,
  followup_date DATE,
  followup_type VARCHAR(50),
  echo_findings TEXT,
  ct_findings TEXT,
  anticoag_status VARCHAR(50),
  notes TEXT,
  cteph_screening_done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pe_fup_tenant ON pe_dvt_followups(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pe_fup_patient ON pe_dvt_followups(patient_id);
CREATE INDEX IF NOT EXISTS idx_pe_fup_date ON pe_dvt_followups(followup_date DESC);
ALTER TABLE pe_dvt_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE pe_dvt_followups FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pe_fup_tenant_isolation ON pe_dvt_followups;
CREATE POLICY pe_fup_tenant_isolation ON pe_dvt_followups
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));
