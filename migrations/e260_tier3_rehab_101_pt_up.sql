-- e260 TIER3_REHAB-101 Physical Therapy UP
CREATE TABLE IF NOT EXISTS rehab_pt_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  encounter_id INTEGER,
  gait_speed_m_per_sec NUMERIC(4,2),
  six_min_walk_distance_m NUMERIC(6,2),
  berg_balance_score INTEGER,
  timed_up_and_go_sec NUMERIC(5,2),
  therapist_id INTEGER,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rehab_pt_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_pt_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehab_pt_a_tenant_isolation ON rehab_pt_assessments;
CREATE POLICY rehab_pt_a_tenant_isolation ON rehab_pt_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rehab_pt_sessions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  session_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  session_date DATE NOT NULL,
  modality VARCHAR(40),
  duration_min INTEGER,
  rpe_score INTEGER,
  notes TEXT
);
ALTER TABLE rehab_pt_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_pt_sessions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehab_pt_s_tenant_isolation ON rehab_pt_sessions;
CREATE POLICY rehab_pt_s_tenant_isolation ON rehab_pt_sessions
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));