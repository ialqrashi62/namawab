-- e325 TIER4_DERM-102 Psoriasis UP
CREATE TABLE IF NOT EXISTS derm_psoriasis_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  pasi_score NUMERIC(5,2),
  bsa_pct NUMERIC(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE derm_psoriasis_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_psoriasis_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS derm_pm_tenant_isolation ON derm_psoriasis_metrics;
CREATE POLICY derm_pm_tenant_isolation ON derm_psoriasis_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));