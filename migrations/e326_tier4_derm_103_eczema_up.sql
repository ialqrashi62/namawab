-- e326 TIER4_DERM-103 Eczema UP
CREATE TABLE IF NOT EXISTS derm_eczema_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  severity VARCHAR(20),
  on_dupilumab BOOLEAN,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE derm_eczema_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_eczema_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS derm_em_tenant_isolation ON derm_eczema_metrics;
CREATE POLICY derm_em_tenant_isolation ON derm_eczema_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));