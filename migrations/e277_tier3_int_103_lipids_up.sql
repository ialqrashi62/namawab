-- e277 TIER3_INT-103 Lipids UP
CREATE TABLE IF NOT EXISTS int_lipid_panel (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  panel_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  total_cholesterol_mg_dl INTEGER,
  ldl_mg_dl INTEGER,
  hdl_mg_dl INTEGER,
  triglycerides_mg_dl INTEGER,
  ascvd_10y_pct NUMERIC(5,2),
  drawn_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE int_lipid_panel ENABLE ROW LEVEL SECURITY;
ALTER TABLE int_lipid_panel FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS int_lp_tenant_isolation ON int_lipid_panel;
CREATE POLICY int_lp_tenant_isolation ON int_lipid_panel
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS int_statin_therapy (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  therapy_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  statin_name VARCHAR(40),
  intensity VARCHAR(20),
  dose_mg VARCHAR(20),
  start_date DATE,
  ldl_at_target VARCHAR(5)
);
ALTER TABLE int_statin_therapy ENABLE ROW LEVEL SECURITY;
ALTER TABLE int_statin_therapy FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS int_st_tenant_isolation ON int_statin_therapy;
CREATE POLICY int_st_tenant_isolation ON int_statin_therapy
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));