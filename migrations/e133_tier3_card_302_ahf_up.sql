-- Migration: TIER3_CARD-302_ADHF (UP) — Non-destructive
-- Advanced Heart Failure tables

CREATE TABLE IF NOT EXISTS hf_cases (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER NOT NULL,
  ef_pct INTEGER CHECK (ef_pct BETWEEN 0 AND 100),
  nyha_class INTEGER CHECK (nyha_class BETWEEN 1 AND 4),
  acc_stage VARCHAR(2),
  nt_probnp INTEGER,
  bnp INTEGER,
  comorbidities TEXT,
  gdmt_score INTEGER,
  intermacs INTEGER CHECK (intermacs BETWEEN 1 AND 7),
  scai_stage VARCHAR(2),
  on_transplant_list BOOLEAN DEFAULT FALSE,
  lvad_id INTEGER,
  status VARCHAR(20) DEFAULT 'active',
  assigned_cardiologist INTEGER,
  created_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_hf_cases_tenant ON hf_cases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hf_cases_patient ON hf_cases(patient_id);
CREATE INDEX IF NOT EXISTS idx_hf_cases_ef ON hf_cases(ef_pct);
CREATE INDEX IF NOT EXISTS idx_hf_cases_nyha ON hf_cases(nyha_class);
ALTER TABLE hf_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE hf_cases FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hf_cases_tenant_isolation ON hf_cases;
CREATE POLICY hf_cases_tenant_isolation ON hf_cases
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS hf_admissions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  hf_case_id INTEGER REFERENCES hf_cases(id),
  patient_id INTEGER NOT NULL,
  admitted_at TIMESTAMPTZ,
  weight_kg NUMERIC(5,2),
  weight_change_kg NUMERIC(5,2),
  iv_diuretic VARCHAR(50),
  dose_mg NUMERIC(6,2),
  urine_output_ml_24h INTEGER,
  discharge_weight NUMERIC(5,2),
  discharge_date DATE,
  hospital_days INTEGER,
  mortality_30d BOOLEAN DEFAULT FALSE,
  mortality_1yr BOOLEAN DEFAULT FALSE,
  readmitted_30d BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_hf_admissions_tenant ON hf_admissions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hf_admissions_patient ON hf_admissions(patient_id);
CREATE INDEX IF NOT EXISTS idx_hf_admissions_admitted ON hf_admissions(admitted_at DESC);
ALTER TABLE hf_admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hf_admissions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hf_admissions_tenant_isolation ON hf_admissions;
CREATE POLICY hf_admissions_tenant_isolation ON hf_admissions
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS lvad_patients (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  hf_case_id INTEGER REFERENCES hf_cases(id),
  patient_id INTEGER NOT NULL,
  device VARCHAR(50),
  implant_date DATE,
  indication VARCHAR(50),
  current_speed INTEGER,
  current_power NUMERIC(4,2),
  current_flow NUMERIC(4,2),
  map_target INTEGER,
  inr_target NUMERIC(3,1),
  complications TEXT,
  last_review_date DATE,
  last_review_by INTEGER,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lvad_patients_tenant ON lvad_patients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lvad_patients_patient ON lvad_patients(patient_id);
CREATE INDEX IF NOT EXISTS idx_lvad_patients_implant ON lvad_patients(implant_date);
ALTER TABLE lvad_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE lvad_patients FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lvad_patients_tenant_isolation ON lvad_patients;
CREATE POLICY lvad_patients_tenant_isolation ON lvad_patients
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS heart_transplants (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  hf_case_id INTEGER REFERENCES hf_cases(id),
  patient_id INTEGER NOT NULL,
  transplant_date DATE NOT NULL,
  donor_id INTEGER,
  donor_age INTEGER,
  donor_cause VARCHAR(100),
  ischaemia_time_min INTEGER,
  immunosuppression_protocol VARCHAR(100),
  induction_therapy VARCHAR(100),
  first_biopsy_date DATE,
  rejection_episode_grade VARCHAR(20),
  cav_status VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_heart_transplants_tenant ON heart_transplants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_heart_transplants_patient ON heart_transplants(patient_id);
CREATE INDEX IF NOT EXISTS idx_heart_transplants_date ON heart_transplants(transplant_date DESC);
ALTER TABLE heart_transplants ENABLE ROW LEVEL SECURITY;
ALTER TABLE heart_transplants FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS heart_transplants_tenant_isolation ON heart_transplants;
CREATE POLICY heart_transplants_tenant_isolation ON heart_transplants
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS hf_medications (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  hf_case_id INTEGER REFERENCES hf_cases(id),
  patient_id INTEGER NOT NULL,
  drug_name VARCHAR(100),
  pillar VARCHAR(50),  -- arni, betablocker, mra, sglt2i, diuretic, anticoag
  dose VARCHAR(50),
  start_date DATE,
  end_date DATE,
  tolerated BOOLEAN DEFAULT TRUE,
  reason_discontinued TEXT,
  prescribed_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_hf_meds_tenant ON hf_medications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hf_meds_patient ON hf_medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_hf_meds_pillar ON hf_medications(pillar);
ALTER TABLE hf_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE hf_medications FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hf_meds_tenant_isolation ON hf_medications;
CREATE POLICY hf_meds_tenant_isolation ON hf_medications
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));
