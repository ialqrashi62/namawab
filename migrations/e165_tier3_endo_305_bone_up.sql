-- e165 TIER3_ENDO-305 Bone & Parathyroid UP
CREATE TABLE IF NOT EXISTS dexa_results (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  dexa_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  classification VARCHAR(30),
  lumbar_tscore NUMERIC(4,2),
  femoral_neck_tscore NUMERIC(4,2),
  hip_total_tscore NUMERIC(4,2),
  scan_date DATE
);
ALTER TABLE dexa_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE dexa_results FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS dexa_r_tenant_isolation ON dexa_results;
CREATE POLICY dexa_r_tenant_isolation ON dexa_results
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS parathyroid_workup (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  workup_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  diagnosis VARCHAR(50),
  surgical_indicated BOOLEAN,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE parathyroid_workup ENABLE ROW LEVEL SECURITY;
ALTER TABLE parathyroid_workup FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pth_w_tenant_isolation ON parathyroid_workup;
CREATE POLICY pth_w_tenant_isolation ON parathyroid_workup
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));