-- e263 TIER3_REHAB-104 Stroke Rehabilitation UP
CREATE TABLE IF NOT EXISTS rehab_stroke_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  nihss_score INTEGER,
  fim_score INTEGER,
  brunnstrom_stage INTEGER,
  modified_ashworth_scale INTEGER,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rehab_stroke_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_stroke_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehab_st_a_tenant_isolation ON rehab_stroke_assessments;
CREATE POLICY rehab_st_a_tenant_isolation ON rehab_stroke_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rehab_stroke_discharges (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  discharge_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  discharge_disposition VARCHAR(40),
  caregiver_training_completed VARCHAR(5),
  home_modifications_done VARCHAR(5),
  discharge_date DATE NOT NULL
);
ALTER TABLE rehab_stroke_discharges ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_stroke_discharges FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehab_st_d_tenant_isolation ON rehab_stroke_discharges;
CREATE POLICY rehab_st_d_tenant_isolation ON rehab_stroke_discharges
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));