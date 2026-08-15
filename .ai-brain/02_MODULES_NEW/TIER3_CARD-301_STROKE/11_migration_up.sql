-- Migration: TIER3_CARD-301_STROKE (UP) — Non-destructive
-- Stroke Center tables

CREATE TABLE IF NOT EXISTS stroke_cases (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER NOT NULL,
  encounter_id INTEGER,
  stroke_type VARCHAR(50),
  arrival_time TIMESTAMPTZ,
  last_known_well TIMESTAMPTZ,
  nihss_score INTEGER CHECK (nihss_score BETWEEN 0 AND 42),
  ct_findings VARCHAR(100),
  aspects_score INTEGER CHECK (aspects_score BETWEEN 0 AND 10),
  code_stroke_activated BOOLEAN DEFAULT FALSE,
  admitted_to_stroke_unit BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active',
  assigned_neurologist INTEGER,
  created_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stroke_cases_tenant ON stroke_cases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_stroke_cases_patient ON stroke_cases(patient_id);
CREATE INDEX IF NOT EXISTS idx_stroke_cases_arrival ON stroke_cases(arrival_time DESC);
ALTER TABLE stroke_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE stroke_cases FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS stroke_cases_tenant_isolation ON stroke_cases;
CREATE POLICY stroke_cases_tenant_isolation ON stroke_cases
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS stroke_thrombolysis (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  stroke_case_id INTEGER REFERENCES stroke_cases(id),
  patient_id INTEGER NOT NULL,
  agent VARCHAR(50) NOT NULL,
  dose_mg NUMERIC(5,2),
  weight_kg NUMERIC(5,2),
  administered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  door_to_needle_minutes INTEGER,
  nihss_before INTEGER,
  nihss_after_24h INTEGER,
  complications TEXT,
  consent_obtained BOOLEAN DEFAULT FALSE,
  consent_witness VARCHAR(100),
  ordering_physician INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stroke_thrombolysis_tenant ON stroke_thrombolysis(tenant_id);
CREATE INDEX IF NOT EXISTS idx_stroke_thrombolysis_admin ON stroke_thrombolysis(administered_at DESC);
CREATE INDEX IF NOT EXISTS idx_stroke_thrombolysis_dnt ON stroke_thrombolysis(door_to_needle_minutes);
ALTER TABLE stroke_thrombolysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE stroke_thrombolysis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS stroke_thrombolysis_tenant_isolation ON stroke_thrombolysis;
CREATE POLICY stroke_thrombolysis_tenant_isolation ON stroke_thrombolysis
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS stroke_thrombectomy (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  stroke_case_id INTEGER REFERENCES stroke_cases(id),
  patient_id INTEGER NOT NULL,
  procedure_time TIMESTAMPTZ,
  door_to_groin_minutes INTEGER,
  tici_score INTEGER CHECK (tici_score BETWEEN 0 AND 3),
  groin_puncture_time TIMESTAMPTZ,
  reperfusion_time TIMESTAMPTZ,
  mrs_24h INTEGER CHECK (mrs_24h BETWEEN 0 AND 6),
  mrs_7d INTEGER CHECK (mrs_7d BETWEEN 0 AND 6),
  mrs_30d INTEGER CHECK (mrs_30d BETWEEN 0 AND 6),
  complications TEXT,
  operator VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stroke_thrombectomy_tenant ON stroke_thrombectomy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_stroke_thrombectomy_tici ON stroke_thrombectomy(tici_score);
ALTER TABLE stroke_thrombectomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE stroke_thrombectomy FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS stroke_thrombectomy_tenant_isolation ON stroke_thrombectomy;
CREATE POLICY stroke_thrombectomy_tenant_isolation ON stroke_thrombectomy
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS stroke_imaging (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  stroke_case_id INTEGER REFERENCES stroke_cases(id),
  patient_id INTEGER NOT NULL,
  imaging_type VARCHAR(50) NOT NULL,
  performed_at TIMESTAMPTZ,
  findings TEXT,
  aspects_score INTEGER CHECK (aspects_score BETWEEN 0 AND 10),
  occlusion_site VARCHAR(50),
  perfusion_findings TEXT,
  radiologist VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stroke_imaging_tenant ON stroke_imaging(tenant_id);
CREATE INDEX IF NOT EXISTS idx_stroke_imaging_patient ON stroke_imaging(patient_id);
ALTER TABLE stroke_imaging ENABLE ROW LEVEL SECURITY;
ALTER TABLE stroke_imaging FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS stroke_imaging_tenant_isolation ON stroke_imaging;
CREATE POLICY stroke_imaging_tenant_isolation ON stroke_imaging
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS stroke_followup (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  stroke_case_id INTEGER REFERENCES stroke_cases(id),
  patient_id INTEGER NOT NULL,
  followup_date DATE,
  mrs_score INTEGER CHECK (mrs_score BETWEEN 0 AND 6),
  medication_adherent BOOLEAN,
  bp_at_goal BOOLEAN,
  recurrent_event BOOLEAN DEFAULT FALSE,
  rehab_status VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stroke_followup_tenant ON stroke_followup(tenant_id);
CREATE INDEX IF NOT EXISTS idx_stroke_followup_date ON stroke_followup(followup_date DESC);
ALTER TABLE stroke_followup ENABLE ROW LEVEL SECURITY;
ALTER TABLE stroke_followup FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS stroke_followup_tenant_isolation ON stroke_followup;
CREATE POLICY stroke_followup_tenant_isolation ON stroke_followup
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));
