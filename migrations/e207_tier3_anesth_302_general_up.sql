-- e207 TIER3_ANESTH-302 General Anesthesia UP
CREATE TABLE IF NOT EXISTS tier3_anesth_general_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  asa_classification TEXT,
  mallampati_class INTEGER,
  difficult_intubation_risk TEXT,
  target_mac NUMERIC(4,2),
  moans_score INTEGER,
  bis_value INTEGER,
  bis_interpretation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_anesth_gen_tenant ON tier3_anesth_general_assessments(tenant_id);
ALTER TABLE tier3_anesth_general_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_anesth_general_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_anesth_gen_t_tenant_isolation ON tier3_anesth_general_assessments;
CREATE POLICY tier3_anesth_gen_t_tenant_isolation ON tier3_anesth_general_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));