-- e299 TIER4_COE-104 Transplant COE UP
CREATE TABLE IF NOT EXISTS coe_transplant_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  organ_type VARCHAR(30),
  transplant_volume_annual INTEGER,
  one_year_graft_survival_pct NUMERIC(5,2),
  rejection_rate_1y_pct NUMERIC(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE coe_transplant_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE coe_transplant_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coe_tm_tenant_isolation ON coe_transplant_metrics;
CREATE POLICY coe_tm_tenant_isolation ON coe_transplant_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));