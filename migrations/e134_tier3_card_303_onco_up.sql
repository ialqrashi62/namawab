-- Migration: TIER3_CARD-303_ONCO (UP) — Non-destructive
-- Cardio-Oncology tables

CREATE TABLE IF NOT EXISTS cardio_onc_cases (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER NOT NULL,
  cancer_type VARCHAR(50),
  cancer_stage VARCHAR(5),
  cancer_diagnosis_date DATE,
  cancer_therapy VARCHAR(50),
  hfa_icos_risk VARCHAR(20),
  baseline_ef_pct INTEGER CHECK (baseline_ef_pct BETWEEN 0 AND 100),
  baseline_gls_pct NUMERIC(4,1),
  comorbidity TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_coo_cases_tenant ON cardio_onc_cases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_coo_cases_patient ON cardio_onc_cases(patient_id);
CREATE INDEX IF NOT EXISTS idx_coo_cases_cancer ON cardio_onc_cases(cancer_type);
CREATE INDEX IF NOT EXISTS idx_coo_cases_risk ON cardio_onc_cases(hfa_icos_risk);
ALTER TABLE cardio_onc_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_onc_cases FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coo_cases_tenant_isolation ON cardio_onc_cases;
CREATE POLICY coo_cases_tenant_isolation ON cardio_onc_cases
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS cardiotoxicity_events (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  case_id INTEGER REFERENCES cardio_onc_cases(id),
  patient_id INTEGER NOT NULL,
  event_type VARCHAR(50),
  ctcae_grade VARCHAR(5),
  ef_pct INTEGER,
  gls_pct NUMERIC(4,1),
  troponin NUMERIC(7,2),
  bnp INTEGER,
  symptoms TEXT,
  treatment_initiated BOOLEAN DEFAULT FALSE,
  cancer_therapy_modified BOOLEAN DEFAULT FALSE,
  reversible BOOLEAN DEFAULT TRUE,
  event_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_coo_events_tenant ON cardiotoxicity_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_coo_events_patient ON cardiotoxicity_events(patient_id);
CREATE INDEX IF NOT EXISTS idx_coo_events_grade ON cardiotoxicity_events(ctcae_grade);
CREATE INDEX IF NOT EXISTS idx_coo_events_date ON cardiotoxicity_events(event_date DESC);
ALTER TABLE cardiotoxicity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardiotoxicity_events FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coo_events_tenant_isolation ON cardiotoxicity_events;
CREATE POLICY coo_events_tenant_isolation ON cardiotoxicity_events
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ici_myocarditis (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  case_id INTEGER REFERENCES cardio_onc_cases(id),
  patient_id INTEGER NOT NULL,
  ici_type VARCHAR(50),
  symptom_onset_date DATE,
  troponin NUMERIC(7,2),
  ef_pct INTEGER,
  ecg_findings TEXT,
  mri_findings TEXT,
  treatment TEXT,
  severity VARCHAR(20),
  outcome TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_coo_ici_tenant ON ici_myocarditis(tenant_id);
CREATE INDEX IF NOT EXISTS idx_coo_ici_patient ON ici_myocarditis(patient_id);
CREATE INDEX IF NOT EXISTS idx_coo_ici_severity ON ici_myocarditis(severity);
CREATE INDEX IF NOT EXISTS idx_coo_ici_date ON ici_myocarditis(symptom_onset_date DESC);
ALTER TABLE ici_myocarditis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ici_myocarditis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coo_ici_tenant_isolation ON ici_myocarditis;
CREATE POLICY coo_ici_tenant_isolation ON ici_myocarditis
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS vte_cancer (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER NOT NULL,
  cancer_type VARCHAR(50),
  vte_type VARCHAR(20),
  location VARCHAR(50),
  diagnosis_date DATE,
  treatment_drug VARCHAR(50),
  dose_mg NUMERIC(6,2),
  treatment_duration_months INTEGER,
  recurrence BOOLEAN DEFAULT FALSE,
  major_bleeding BOOLEAN DEFAULT FALSE,
  on_chemo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_coo_vte_tenant ON vte_cancer(tenant_id);
CREATE INDEX IF NOT EXISTS idx_coo_vte_patient ON vte_cancer(patient_id);
CREATE INDEX IF NOT EXISTS idx_coo_vte_cancer ON vte_cancer(cancer_type);
CREATE INDEX IF NOT EXISTS idx_coo_vte_date ON vte_cancer(diagnosis_date DESC);
ALTER TABLE vte_cancer ENABLE ROW LEVEL SECURITY;
ALTER TABLE vte_cancer FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coo_vte_tenant_isolation ON vte_cancer;
CREATE POLICY coo_vte_tenant_isolation ON vte_cancer
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));
