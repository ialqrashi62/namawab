-- e324 TIER4_DERM-101 Acne UP
CREATE TABLE IF NOT EXISTS derm_acne_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  severity VARCHAR(30),
  on_isotretinoin BOOLEAN,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE derm_acne_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_acne_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS derm_am_tenant_isolation ON derm_acne_metrics;
CREATE POLICY derm_am_tenant_isolation ON derm_acne_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));