-- e318 TIER4_PEDS-103 Pediatric Neurology UP
CREATE TABLE IF NOT EXISTS peds_pneuro_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  age_years INTEGER,
  syndrome VARCHAR(30),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE peds_pneuro_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE peds_pneuro_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS peds_pnm_tenant_isolation ON peds_pneuro_metrics;
CREATE POLICY peds_pnm_tenant_isolation ON peds_pneuro_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));