-- e280 TIER3_INT-106 Pre-Op Medical Clearance UP
CREATE TABLE IF NOT EXISTS int_preop_clearance (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  clearance_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  planned_procedure TEXT,
  asa_class VARCHAR(5),
  revised_cardiac_risk_index INTEGER,
  functional_capacity_mets NUMERIC(4,1),
  clearance_status VARCHAR(30),
  anticoag_plan TEXT,
  cleared_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cleared_by INTEGER
);
ALTER TABLE int_preop_clearance ENABLE ROW LEVEL SECURITY;
ALTER TABLE int_preop_clearance FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS int_pc_tenant_isolation ON int_preop_clearance;
CREATE POLICY int_pc_tenant_isolation ON int_preop_clearance
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));