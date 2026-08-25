-- e182 TIER3_MUSK-302 Sports UP
CREATE TABLE IF NOT EXISTS sports_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  injury_type VARCHAR(50),
  surgical_intervention VARCHAR(100),
  return_to_sport_cleared BOOLEAN,
  last_assessment_date DATE
);
ALTER TABLE sports_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sports_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS spr_r_tenant_isolation ON sports_records;
CREATE POLICY spr_r_tenant_isolation ON sports_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));