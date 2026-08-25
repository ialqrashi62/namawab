-- e303 TIER4_COE-108 Pediatric COE UP
CREATE TABLE IF NOT EXISTS coe_peds_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  pediatric_admits_annual INTEGER,
  family_centered_rounds_pct NUMERIC(5,2),
  transition_completion_pct NUMERIC(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE coe_peds_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE coe_peds_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coe_pm_tenant_isolation ON coe_peds_metrics;
CREATE POLICY coe_pm_tenant_isolation ON coe_peds_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));