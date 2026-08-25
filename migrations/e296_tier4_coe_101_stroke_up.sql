-- e296 TIER4_COE-101 Stroke COE UP
CREATE TABLE IF NOT EXISTS coe_stroke_center_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  metric_period VARCHAR(20),
  door_to_needle_min INTEGER,
  door_to_puncture_min INTEGER,
  in_hospital_mortality_pct NUMERIC(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE coe_stroke_center_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE coe_stroke_center_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coe_scm_tenant_isolation ON coe_stroke_center_metrics;
CREATE POLICY coe_scm_tenant_isolation ON coe_stroke_center_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));