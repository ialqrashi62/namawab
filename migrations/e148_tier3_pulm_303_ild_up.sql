-- e148 TIER3_PULM-303 ILD UP
CREATE TABLE IF NOT EXISTS ild_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  gap_stage VARCHAR(5),
  mortality_1y_pct NUMERIC(5,2),
  pirfenidone_eligible BOOLEAN,
  nintedanib_eligible BOOLEAN,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assessed_by INTEGER
);
ALTER TABLE ild_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ild_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ild_a_tenant_isolation ON ild_assessments;
CREATE POLICY ild_a_tenant_isolation ON ild_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ild_progression (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  progression_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  fvc_change_pct NUMERIC(5,2),
  progressive_fibrosing BOOLEAN,
  monitored_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ild_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE ild_progression FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ild_p_tenant_isolation ON ild_progression;
CREATE POLICY ild_p_tenant_isolation ON ild_progression
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));