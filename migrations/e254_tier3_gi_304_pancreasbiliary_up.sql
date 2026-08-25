-- e254 TIER3_GI-304 Pancreas/Biliary UP
CREATE TABLE IF NOT EXISTS tier3_gi_pancreasbiliary_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  bisap_score INTEGER,
  pancreatitis_severity TEXT,
  chronic_pancreatitis_diagnosis TEXT,
  cholecystectomy_indicated BOOLEAN DEFAULT false,
  cholangitis_severity TEXT,
  biliary_suspicion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_gi_pb_tenant ON tier3_gi_pancreasbiliary_assessments(tenant_id);
ALTER TABLE tier3_gi_pancreasbiliary_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_gi_pancreasbiliary_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_gi_pb_t_tenant_isolation ON tier3_gi_pancreasbiliary_assessments;
CREATE POLICY tier3_gi_pb_t_tenant_isolation ON tier3_gi_pancreasbiliary_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));