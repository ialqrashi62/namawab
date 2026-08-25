-- e222 TIER3_OPHTH-302 Glaucoma UP
CREATE TABLE IF NOT EXISTS tier3_ophth_glaucoma_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  iop_value_mmhg NUMERIC(5,2),
  iop_interpretation TEXT,
  angle_closure_attack BOOLEAN DEFAULT false,
  target_iop_mmhg NUMERIC(5,2),
  optic_disc_cd_ratio NUMERIC(3,2),
  vf_md_db NUMERIC(5,2),
  progression_status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_ophth_gl_tenant ON tier3_ophth_glaucoma_assessments(tenant_id);
ALTER TABLE tier3_ophth_glaucoma_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_ophth_glaucoma_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_ophth_gl_t_tenant_isolation ON tier3_ophth_glaucoma_assessments;
CREATE POLICY tier3_ophth_gl_t_tenant_isolation ON tier3_ophth_glaucoma_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));