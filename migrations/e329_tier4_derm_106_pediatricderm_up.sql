-- e329 TIER4_DERM-106 Pediatric Derm UP
CREATE TABLE IF NOT EXISTS derm_peds_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  syndrome VARCHAR(30),
  age_months INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE derm_peds_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_peds_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS derm_pdm_tenant_isolation ON derm_peds_metrics;
CREATE POLICY derm_pdm_tenant_isolation ON derm_peds_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));