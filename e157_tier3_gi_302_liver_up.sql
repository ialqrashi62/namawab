-- e157 TIER3_GI-302 Liver UP
CREATE TABLE IF NOT EXISTS liver_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  child_pugh_class VARCHAR(5),
  child_pugh_total INTEGER,
  meld_score INTEGER,
  meld_na_score INTEGER,
  fibrosis_stage VARCHAR(20),
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE liver_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE liver_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS liver_a_tenant_isolation ON liver_assessments;
CREATE POLICY liver_a_tenant_isolation ON liver_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS liver_ascites (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  log_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  grade VARCHAR(10),
  refractory BOOLEAN,
  paracentesis_count INTEGER DEFAULT 0,
  treatment_plan TEXT
);
ALTER TABLE liver_ascites ENABLE ROW LEVEL SECURITY;
ALTER TABLE liver_ascites FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS liver_as_tenant_isolation ON liver_ascites;
CREATE POLICY liver_as_tenant_isolation ON liver_ascites
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));