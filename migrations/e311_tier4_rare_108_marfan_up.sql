-- e311 TIER4_RARE-108 Marfan UP
CREATE TABLE IF NOT EXISTS rare_marfan_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  aortic_root_mm NUMERIC(5,1),
  diagnosis VARCHAR(20),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rare_marfan_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_marfan_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_mfm_tenant_isolation ON rare_marfan_metrics;
CREATE POLICY rare_mfm_tenant_isolation ON rare_marfan_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));