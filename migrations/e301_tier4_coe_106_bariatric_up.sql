-- e301 TIER4_COE-106 Bariatric COE UP
CREATE TABLE IF NOT EXISTS coe_bariatric_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  bariatric_volume_annual INTEGER,
  one_year_ewl_pct NUMERIC(5,2),
  complication_30d_pct NUMERIC(5,2),
  readmission_30d_pct NUMERIC(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE coe_bariatric_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE coe_bariatric_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coe_bm_tenant_isolation ON coe_bariatric_metrics;
CREATE POLICY coe_bm_tenant_isolation ON coe_bariatric_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));