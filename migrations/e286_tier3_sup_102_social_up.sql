-- e286 TIER3_SUP-102 Social Work UP
CREATE TABLE IF NOT EXISTS sup_social_screenings (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  screening_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  social_determinants_risk VARCHAR(20),
  food_insecurity VARCHAR(5),
  housing_insecurity VARCHAR(5),
  transportation_barrier VARCHAR(5),
  financial_concern VARCHAR(5),
  caregiver_availability VARCHAR(20),
  screened_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE sup_social_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sup_social_screenings FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sup_ss_tenant_isolation ON sup_social_screenings;
CREATE POLICY sup_ss_tenant_isolation ON sup_social_screenings
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS sup_discharge_barriers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  barrier_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  barrier_category VARCHAR(60),
  barrier_description TEXT,
  resolution_status VARCHAR(20),
  resolution_plan TEXT,
  identified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE sup_discharge_barriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sup_discharge_barriers FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sup_db_tenant_isolation ON sup_discharge_barriers;
CREATE POLICY sup_db_tenant_isolation ON sup_discharge_barriers
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));