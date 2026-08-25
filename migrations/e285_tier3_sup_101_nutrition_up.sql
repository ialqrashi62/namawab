-- e285 TIER3_SUP-101 Clinical Nutrition UP
CREATE TABLE IF NOT EXISTS sup_nutrition_screenings (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  screening_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  must_score INTEGER,
  risk_category VARCHAR(30),
  bmi NUMERIC(4,2),
  weight_loss_kg NUMERIC(5,2),
  rd_referral VARCHAR(5),
  screened_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE sup_nutrition_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sup_nutrition_screenings FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sup_ns_tenant_isolation ON sup_nutrition_screenings;
CREATE POLICY sup_ns_tenant_isolation ON sup_nutrition_screenings
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS sup_nutrition_orders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  diet_type VARCHAR(60),
  enteral_access VARCHAR(30),
  parenteral_access VARCHAR(30),
  caloric_target VARCHAR(30),
  protein_target VARCHAR(30),
  prescribed_by INTEGER,
  prescribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE sup_nutrition_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sup_nutrition_orders FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sup_no_tenant_isolation ON sup_nutrition_orders;
CREATE POLICY sup_no_tenant_isolation ON sup_nutrition_orders
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));