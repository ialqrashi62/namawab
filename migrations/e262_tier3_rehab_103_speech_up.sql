-- e262 TIER3_REHAB-103 Speech-Language Pathology UP
CREATE TABLE IF NOT EXISTS rehab_slp_screenings (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  screening_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  language_age_equiv_months INTEGER,
  receptive_age_equiv_months INTEGER,
  feeding_swallowing_score VARCHAR(30),
  voice_grade_roughness VARCHAR(20),
  slp_id INTEGER,
  screened_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rehab_slp_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_slp_screenings FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehab_slp_a_tenant_isolation ON rehab_slp_screenings;
CREATE POLICY rehab_slp_a_tenant_isolation ON rehab_slp_screenings
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rehab_slp_sessions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  session_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  session_date DATE NOT NULL,
  therapy_type VARCHAR(40),
  duration_min INTEGER,
  goals TEXT
);
ALTER TABLE rehab_slp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_slp_sessions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehab_slp_s_tenant_isolation ON rehab_slp_sessions;
CREATE POLICY rehab_slp_s_tenant_isolation ON rehab_slp_sessions
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));