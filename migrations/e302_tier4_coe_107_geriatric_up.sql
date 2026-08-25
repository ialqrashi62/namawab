-- e302 TIER4_COE-107 Geriatric COE UP
CREATE TABLE IF NOT EXISTS coe_geriatric_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  cga_completion_pct NUMERIC(5,2),
  polypharmacy_review_pct NUMERIC(5,2),
  fall_rate NUMERIC(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE coe_geriatric_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE coe_geriatric_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coe_gm_tenant_isolation ON coe_geriatric_metrics;
CREATE POLICY coe_gm_tenant_isolation ON coe_geriatric_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));