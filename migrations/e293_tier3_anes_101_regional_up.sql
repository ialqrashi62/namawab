-- e293 TIER3_ANES-101 Regional Anesthesia UP
CREATE TABLE IF NOT EXISTS anes_regional_blocks (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  block_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  procedure_type VARCHAR(60),
  target_nerve VARCHAR(60),
  technique VARCHAR(40),
  ultrasound_guided VARCHAR(5),
  local_anesthetic VARCHAR(60),
  complications VARCHAR(40),
  performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  performed_by INTEGER
);
ALTER TABLE anes_regional_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE anes_regional_blocks FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anes_rb_tenant_isolation ON anes_regional_blocks;
CREATE POLICY anes_rb_tenant_isolation ON anes_regional_blocks
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));