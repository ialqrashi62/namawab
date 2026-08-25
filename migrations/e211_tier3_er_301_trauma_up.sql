-- e211 TIER3_ER-301 Adult Trauma UP
CREATE TABLE IF NOT EXISTS tier3_er_trauma_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  gcs_total INTEGER,
  gcs_severity TEXT,
  trauma_team_activation TEXT,
  shock_classification TEXT,
  damage_control_indicated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_er_trauma_tenant ON tier3_er_trauma_assessments(tenant_id);
ALTER TABLE tier3_er_trauma_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_er_trauma_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_er_trauma_t_tenant_isolation ON tier3_er_trauma_assessments;
CREATE POLICY tier3_er_trauma_t_tenant_isolation ON tier3_er_trauma_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));