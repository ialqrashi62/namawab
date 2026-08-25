-- e237 TIER3_RHEUM-302 SLE UP
CREATE TABLE IF NOT EXISTS tier3_rheum_sle_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  sle_score INTEGER,
  sledai_score INTEGER,
  lupus_severity TEXT,
  mctd_likely BOOLEAN DEFAULT false,
  aps_likely BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_rheum_sle_tenant ON tier3_rheum_sle_assessments(tenant_id);
ALTER TABLE tier3_rheum_sle_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_rheum_sle_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_rheum_sle_t_tenant_isolation ON tier3_rheum_sle_assessments;
CREATE POLICY tier3_rheum_sle_t_tenant_isolation ON tier3_rheum_sle_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));