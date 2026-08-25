-- e409 TIER4_PSYCH-101 MDD
CREATE TABLE IF NOT EXISTS tier4_psych_101_depression_phq9 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  phq9 INT NOT NULL,
  suicidal_ideation_q9 BOOLEAN,
  severity TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_101_depression_phq9 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_101_depression_phq9 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_101_depression_phq9_t ON tier4_psych_101_depression_phq9;
CREATE POLICY tier4_psych_101_depression_phq9_t ON tier4_psych_101_depression_phq9
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_psych_101_depression_trd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  adequate_prior_trials INT,
  adherence_confirmed BOOLEAN,
  classification TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_101_depression_trd ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_101_depression_trd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_101_depression_trd_t ON tier4_psych_101_depression_trd;
CREATE POLICY tier4_psych_101_depression_trd_t ON tier4_psych_101_depression_trd
  USING (tenant_id = current_setting('app.tenant_id', true));