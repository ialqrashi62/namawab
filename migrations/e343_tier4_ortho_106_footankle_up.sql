-- e343 TIER4_ORTHO-106 Foot/Ankle UP
CREATE TABLE IF NOT EXISTS ortho_foot_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  diagnosis VARCHAR(30),
  ulcer_severity VARCHAR(20),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ortho_foot_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortho_foot_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ortho_ft_tenant_isolation ON ortho_foot_metrics;
CREATE POLICY ortho_ft_tenant_isolation ON ortho_foot_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));