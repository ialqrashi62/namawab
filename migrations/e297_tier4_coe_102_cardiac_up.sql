-- e297 TIER4_COE-102 Cardiac COE UP
CREATE TABLE IF NOT EXISTS coe_cardiac_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  cardiac_volume_annual INTEGER,
  stemi_door_to_balloon_min INTEGER,
  mortality_30d_pct NUMERIC(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE coe_cardiac_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE coe_cardiac_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coe_cm_tenant_isolation ON coe_cardiac_metrics;
CREATE POLICY coe_cm_tenant_isolation ON coe_cardiac_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));