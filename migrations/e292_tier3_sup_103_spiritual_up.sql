-- e292 TIER3_SUP-103 Spiritual Care UP
CREATE TABLE IF NOT EXISTS sup_spiritual_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  faith_religion VARCHAR(40),
  importance_score INTEGER,
  spiritual_distress VARCHAR(5),
  chaplain_referral VARCHAR(5),
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE sup_spiritual_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sup_spiritual_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sup_sa_tenant_isolation ON sup_spiritual_assessments;
CREATE POLICY sup_sa_tenant_isolation ON sup_spiritual_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS sup_chaplain_visits (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  visit_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  chaplain_name VARCHAR(60),
  visit_type VARCHAR(30),
  visit_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE sup_chaplain_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE sup_chaplain_visits FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sup_cv_tenant_isolation ON sup_chaplain_visits;
CREATE POLICY sup_cv_tenant_isolation ON sup_chaplain_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));