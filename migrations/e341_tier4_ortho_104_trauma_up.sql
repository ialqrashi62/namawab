-- e341 TIER4_ORTHO-104 Trauma UP
CREATE TABLE IF NOT EXISTS ortho_trauma_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  fracture_type VARCHAR(30),
  patient_age INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ortho_trauma_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortho_trauma_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ortho_tr_tenant_isolation ON ortho_trauma_metrics;
CREATE POLICY ortho_tr_tenant_isolation ON ortho_trauma_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));