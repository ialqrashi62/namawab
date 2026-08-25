-- e245 TIER3_URO-305 Andrology UP
CREATE TABLE IF NOT EXISTS tier3_uro_andrology_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  semen_interpretation TEXT,
  hypogonadism_type TEXT,
  ed_primary_cause TEXT,
  vasectomy_reversal_success_pct NUMERIC(5,2),
  testicular_pain_red_flags BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_uro_andro_tenant ON tier3_uro_andrology_assessments(tenant_id);
ALTER TABLE tier3_uro_andrology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_uro_andrology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_uro_andro_t_tenant_isolation ON tier3_uro_andrology_assessments;
CREATE POLICY tier3_uro_andro_t_tenant_isolation ON tier3_uro_andrology_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));