-- e249 TIER3_GI-304 Pancreas/Biliary UP
CREATE TABLE IF NOT EXISTS tier3_gi_pancreatobiliary_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  pancreatitis_severity TEXT,
  bismuth_classification TEXT,
  gallstone_composition TEXT,
  pancreatic_cyst_category TEXT,
  ercp_indicated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_gi_panbil_tenant ON tier3_gi_pancreatobiliary_assessments(tenant_id);
ALTER TABLE tier3_gi_pancreatobiliary_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_gi_pancreatobiliary_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_gi_panbil_t_tenant_isolation ON tier3_gi_pancreatobiliary_assessments;
CREATE POLICY tier3_gi_panbil_t_tenant_isolation ON tier3_gi_pancreatobiliary_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));