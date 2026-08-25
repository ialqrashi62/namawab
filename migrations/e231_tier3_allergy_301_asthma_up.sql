-- e231 TIER3_ALLERGY-301 Asthma UP
CREATE TABLE IF NOT EXISTS tier3_allergy_asthma_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  act_score INTEGER,
  asthma_severity TEXT,
  control_level TEXT,
  biologic_eligible BOOLEAN DEFAULT false,
  biologic_choice TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_allergy_asm_tenant ON tier3_allergy_asthma_assessments(tenant_id);
ALTER TABLE tier3_allergy_asthma_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_allergy_asthma_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_allergy_asm_t_tenant_isolation ON tier3_allergy_asthma_assessments;
CREATE POLICY tier3_allergy_asm_t_tenant_isolation ON tier3_allergy_asthma_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));