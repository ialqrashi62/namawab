-- e300 TIER4_COE-105 Trauma COE UP
CREATE TABLE IF NOT EXISTS coe_trauma_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  trauma_volume_annual INTEGER,
  iss_average NUMERIC(4,1),
  mortality_pct NUMERIC(5,2),
  tqip_observed_vs_expected NUMERIC(4,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE coe_trauma_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE coe_trauma_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coe_tr_tenant_isolation ON coe_trauma_metrics;
CREATE POLICY coe_tr_tenant_isolation ON coe_trauma_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));