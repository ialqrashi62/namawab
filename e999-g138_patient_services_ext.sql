-- filepath: migrations/e999-g138_patient_services_ext.sql
CREATE TABLE IF NOT EXISTS tier118_patient_experience_620 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  feedback_id TEXT, complaint_id TEXT, advocate_id TEXT, education_id TEXT, comm_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier118_patient_experience_620 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier118_patient_experience_620 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t118_pat_exp_620_isolation ON tier118_patient_experience_620;
CREATE POLICY t118_pat_exp_620_isolation ON tier118_patient_experience_620 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier118_volunteer_services_621 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  assignment_id TEXT, hours_id TEXT, transaction_id TEXT, visit_id TEXT, assist_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier118_volunteer_services_621 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier118_volunteer_services_621 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t118_vol_621_isolation ON tier118_volunteer_services_621;
CREATE POLICY t118_vol_621_isolation ON tier118_volunteer_services_621 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier118_social_services_622 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  assessment_id TEXT, plan_id TEXT, screening_id TEXT, counseling_id TEXT, resource_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier118_social_services_622 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier118_social_services_622 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t118_soc_622_isolation ON tier118_social_services_622;
CREATE POLICY t118_soc_622_isolation ON tier118_social_services_622 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier118_interpreter_623 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  request_id TEXT, translation_id TEXT, assessment_id TEXT, nav_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier118_interpreter_623 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier118_interpreter_623 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t118_int_623_isolation ON tier118_interpreter_623;
CREATE POLICY t118_int_623_isolation ON tier118_interpreter_623 USING (tenant_id = current_setting('app.tenant_id', true));