-- e313 TIER4_RARE-110 PPGL UP
CREATE TABLE IF NOT EXISTS rare_ppgl_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  plasma_normetanephrine_pg_ml NUMERIC(8,2),
  on_phenoxy BOOLEAN,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rare_ppgl_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_ppgl_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_pm_tenant_isolation ON rare_ppgl_metrics;
CREATE POLICY rare_pm_tenant_isolation ON rare_ppgl_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));