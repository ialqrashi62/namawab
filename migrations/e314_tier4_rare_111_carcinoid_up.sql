-- e314 TIER4_RARE-111 Carcinoid UP
CREATE TABLE IF NOT EXISTS rare_carcinoid_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  syndrome_present BOOLEAN,
  biochemical_marker VARCHAR(20),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rare_carcinoid_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_carcinoid_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_cm_tenant_isolation ON rare_carcinoid_metrics;
CREATE POLICY rare_cm_tenant_isolation ON rare_carcinoid_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));