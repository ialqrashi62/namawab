-- e246 TIER3_NEPHRO-301 CKD UP
CREATE TABLE IF NOT EXISTS tier3_nephro_ckd_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  ckd_stage TEXT,
  albuminuria_grade TEXT,
  egfr_ml_min_1_73m2 NUMERIC(5,2),
  progression_risk TEXT,
  epo_initiation_indicated BOOLEAN DEFAULT false,
  mbd_severity TEXT,
  bp_target TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_nephro_ckd_tenant ON tier3_nephro_ckd_assessments(tenant_id);
ALTER TABLE tier3_nephro_ckd_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_nephro_ckd_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_nephro_ckd_t_tenant_isolation ON tier3_nephro_ckd_assessments;
CREATE POLICY tier3_nephro_ckd_t_tenant_isolation ON tier3_nephro_ckd_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));