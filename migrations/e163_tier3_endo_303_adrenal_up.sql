-- e163 TIER3_ENDO-303 Adrenal UP
CREATE TABLE IF NOT EXISTS adrenal_workup (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  workup_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  diagnosis VARCHAR(50),
  acth_status VARCHAR(50),
  surgical_referral BOOLEAN,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE adrenal_workup ENABLE ROW LEVEL SECURITY;
ALTER TABLE adrenal_workup FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adr_w_tenant_isolation ON adrenal_workup;
CREATE POLICY adr_w_tenant_isolation ON adrenal_workup
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));