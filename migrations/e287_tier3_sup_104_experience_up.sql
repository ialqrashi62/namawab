-- e287 TIER3_SUP-104 Patient Experience UP
CREATE TABLE IF NOT EXISTS sup_hcahps_scores (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  score_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  survey_period VARCHAR(20),
  nurse_communication_score INTEGER,
  doctor_communication_score INTEGER,
  overall_rating INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE sup_hcahps_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE sup_hcahps_scores FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sup_hc_tenant_isolation ON sup_hcahps_scores;
CREATE POLICY sup_hc_tenant_isolation ON sup_hcahps_scores
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS sup_complaints (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  complaint_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER,
  complainant_name VARCHAR(60),
  category VARCHAR(60),
  severity VARCHAR(20),
  status VARCHAR(20),
  filed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE sup_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE sup_complaints FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sup_co_tenant_isolation ON sup_complaints;
CREATE POLICY sup_co_tenant_isolation ON sup_complaints
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));