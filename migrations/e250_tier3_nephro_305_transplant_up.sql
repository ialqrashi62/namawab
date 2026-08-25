-- e250 TIER3_NEPHRO-305 Transplant UP
CREATE TABLE IF NOT EXISTS tier3_nephro_transplant_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  eligible_for_evaluation BOOLEAN DEFAULT false,
  abo_compatible BOOLEAN DEFAULT false,
  immunological_risk TEXT,
  rejection_type TEXT,
  post_tx_etiology TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_nephro_tx_tenant ON tier3_nephro_transplant_assessments(tenant_id);
ALTER TABLE tier3_nephro_transplant_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_nephro_transplant_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_nephro_tx_t_tenant_isolation ON tier3_nephro_transplant_assessments;
CREATE POLICY tier3_nephro_tx_t_tenant_isolation ON tier3_nephro_transplant_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));