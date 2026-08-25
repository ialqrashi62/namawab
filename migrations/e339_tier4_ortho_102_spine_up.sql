-- e339 TIER4_ORTHO-102 Spine UP
CREATE TABLE IF NOT EXISTS ortho_spine_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  diagnosis VARCHAR(30),
  cobb_angle INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ortho_spine_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortho_spine_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ortho_sn_tenant_isolation ON ortho_spine_metrics;
CREATE POLICY ortho_sn_tenant_isolation ON ortho_spine_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));