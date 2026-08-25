-- e279 TIER3_INT-105 Anemia Workup UP
CREATE TABLE IF NOT EXISTS int_anemia_workup (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  workup_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  hemoglobin_g_dl NUMERIC(4,2),
  mcv_fL NUMERIC(5,1),
  ferritin_ng_ml NUMERIC(7,2),
  iron_saturation_pct NUMERIC(5,2),
  b12_pg_ml NUMERIC(7,2),
  folate_ng_ml NUMERIC(6,2),
  reticulocyte_pct NUMERIC(5,2),
  classification VARCHAR(40),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE int_anemia_workup ENABLE ROW LEVEL SECURITY;
ALTER TABLE int_anemia_workup FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS int_aw_tenant_isolation ON int_anemia_workup;
CREATE POLICY int_aw_tenant_isolation ON int_anemia_workup
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS int_transfusion_log (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  transfusion_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  component_type VARCHAR(30),
  units INTEGER,
  pre_hemoglobin NUMERIC(4,2),
  post_hemoglobin NUMERIC(4,2),
  reaction VARCHAR(5),
  transfusion_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE int_transfusion_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE int_transfusion_log FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS int_tf_tenant_isolation ON int_transfusion_log;
CREATE POLICY int_tf_tenant_isolation ON int_transfusion_log
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));