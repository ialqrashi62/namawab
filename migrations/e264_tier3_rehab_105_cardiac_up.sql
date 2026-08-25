-- e264 TIER3_REHAB-105 Cardiac / Pulmonary Rehabilitation UP
CREATE TABLE IF NOT EXISTS rehab_cardiac_enrollment (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  enrollment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  indication VARCHAR(40),
  phase VARCHAR(20),
  enrollment_date DATE NOT NULL,
  expected_sessions INTEGER
);
ALTER TABLE rehab_cardiac_enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_cardiac_enrollment FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehab_c_e_tenant_isolation ON rehab_cardiac_enrollment;
CREATE POLICY rehab_c_e_tenant_isolation ON rehab_cardiac_enrollment
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rehab_exercise_prescriptions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  prescription_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  modality VARCHAR(40),
  intensity_percent_hrr NUMERIC(4,2),
  frequency_per_week INTEGER,
  duration_min INTEGER,
  prescribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rehab_exercise_prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_exercise_prescriptions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehab_ep_tenant_isolation ON rehab_exercise_prescriptions;
CREATE POLICY rehab_ep_tenant_isolation ON rehab_exercise_prescriptions
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));