-- e278 TIER3_INT-104 Thyroid Function UP
CREATE TABLE IF NOT EXISTS int_tft_results (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  tft_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  tsh_miu_l NUMERIC(6,3),
  free_t4_ng_dl NUMERIC(5,2),
  free_t3_pg_ml NUMERIC(5,2),
  interpretation VARCHAR(40),
  drawn_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE int_tft_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE int_tft_results FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS int_tft_tenant_isolation ON int_tft_results;
CREATE POLICY int_tft_tenant_isolation ON int_tft_results
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS int_thyroid_levothyroxine (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  rx_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  dose_mcg VARCHAR(20),
  started_date DATE,
  target_tsh VARCHAR(30),
  status VARCHAR(20)
);
ALTER TABLE int_thyroid_levothyroxine ENABLE ROW LEVEL SECURITY;
ALTER TABLE int_thyroid_levothyroxine FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS int_lt_tenant_isolation ON int_thyroid_levothyroxine;
CREATE POLICY int_lt_tenant_isolation ON int_thyroid_levothyroxine
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));