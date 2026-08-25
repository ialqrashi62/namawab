-- e188 TIER3_OBGYN-303 Postpartum UP
CREATE TABLE IF NOT EXISTS postpartum_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  epds_score INTEGER,
  breastfeeding_status VARCHAR(30),
  contraceptive_method VARCHAR(50),
  follow_up_visit_date DATE,
  ppd_diagnosed BOOLEAN DEFAULT false
);
ALTER TABLE postpartum_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE postpartum_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pp_r_tenant_isolation ON postpartum_records;
CREATE POLICY pp_r_tenant_isolation ON postpartum_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));