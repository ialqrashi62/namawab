-- e248 TIER3_NEPHRO-303 Dialysis UP
CREATE TABLE IF NOT EXISTS tier3_nephro_dialysis_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  preferred_access TEXT,
  pd_candidate BOOLEAN DEFAULT false,
  kt_v NUMERIC(4,2),
  urr_pct NUMERIC(5,2),
  adequacy TEXT,
  access_complication TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_nephro_dial_tenant ON tier3_nephro_dialysis_assessments(tenant_id);
ALTER TABLE tier3_nephro_dialysis_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_nephro_dialysis_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_nephro_dial_t_tenant_isolation ON tier3_nephro_dialysis_assessments;
CREATE POLICY tier3_nephro_dial_t_tenant_isolation ON tier3_nephro_dialysis_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));