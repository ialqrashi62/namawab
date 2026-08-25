-- e261 TIER3_REHAB-102 Occupational Therapy UP
CREATE TABLE IF NOT EXISTS rehab_ot_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  barthel_index_score INTEGER,
  lawton_iadl_score INTEGER,
  copm_performance NUMERIC(4,2),
  copm_satisfaction NUMERIC(4,2),
  therapist_id INTEGER,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rehab_ot_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_ot_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehab_ot_a_tenant_isolation ON rehab_ot_assessments;
CREATE POLICY rehab_ot_a_tenant_isolation ON rehab_ot_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rehab_ot_orthoses (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  orthosis_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  orthosis_type VARCHAR(60),
  joint_splinted VARCHAR(60),
  wear_schedule VARCHAR(60),
  prescribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rehab_ot_orthoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_ot_orthoses FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehab_ot_o_tenant_isolation ON rehab_ot_orthoses;
CREATE POLICY rehab_ot_o_tenant_isolation ON rehab_ot_orthoses
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));