-- e328 TIER4_DERM-105 Bullous UP
CREATE TABLE IF NOT EXISTS derm_bullous_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  subtype VARCHAR(30),
  bp180_antibody NUMERIC(8,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE derm_bullous_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_bullous_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS derm_bm_tenant_isolation ON derm_bullous_metrics;
CREATE POLICY derm_bm_tenant_isolation ON derm_bullous_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));