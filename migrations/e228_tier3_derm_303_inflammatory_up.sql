-- e228 TIER3_DERM-303 Inflammatory Derm UP
CREATE TABLE IF NOT EXISTS tier3_derm_inflammatory_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  ad_severity TEXT,
  biologic_candidate BOOLEAN DEFAULT false,
  urticaria_severity TEXT,
  lupus_sledai_score INTEGER,
  autoimmune_blister_diagnosis TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_derm_inf_tenant ON tier3_derm_inflammatory_assessments(tenant_id);
ALTER TABLE tier3_derm_inflammatory_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_derm_inflammatory_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_derm_inf_t_tenant_isolation ON tier3_derm_inflammatory_assessments;
CREATE POLICY tier3_derm_inf_t_tenant_isolation ON tier3_derm_inflammatory_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));