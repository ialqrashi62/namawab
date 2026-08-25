-- e205 TIER3_RAD-305 Interventional Radiology UP
CREATE TABLE IF NOT EXISTS tier3_rad_ir_procedures (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  tips_indication_met BOOLEAN DEFAULT false,
  biopsy_feasibility TEXT,
  stent_recommendation TEXT,
  drainage_indication TEXT,
  ablation_choice TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_rad_ir_tenant ON tier3_rad_ir_procedures(tenant_id);
ALTER TABLE tier3_rad_ir_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_rad_ir_procedures FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_rad_ir_t_tenant_isolation ON tier3_rad_ir_procedures;
CREATE POLICY tier3_rad_ir_t_tenant_isolation ON tier3_rad_ir_procedures
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));