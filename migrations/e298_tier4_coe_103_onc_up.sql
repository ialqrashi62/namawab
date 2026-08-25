-- e298 TIER4_COE-103 Oncology COE UP
CREATE TABLE IF NOT EXISTS coe_onc_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  analytic_cases_annual INTEGER,
  tumor_board_count_year INTEGER,
  clinical_trials_open INTEGER,
  survivorship_plan_pct NUMERIC(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE coe_onc_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE coe_onc_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coe_om_tenant_isolation ON coe_onc_metrics;
CREATE POLICY coe_om_tenant_isolation ON coe_onc_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));