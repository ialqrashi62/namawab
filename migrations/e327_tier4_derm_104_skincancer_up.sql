-- e327 TIER4_DERM-104 Skin Cancer UP
CREATE TABLE IF NOT EXISTS derm_skincancer_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  diagnosis VARCHAR(30),
  breslow_mm NUMERIC(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE derm_skincancer_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_skincancer_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS derm_scm_tenant_isolation ON derm_skincancer_metrics;
CREATE POLICY derm_scm_tenant_isolation ON derm_skincancer_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));