-- e320 TIER4_PEDS-105 Pediatric Endocrinology UP
CREATE TABLE IF NOT EXISTS peds_pendo_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  age_years INTEGER,
  dka_severity VARCHAR(20),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE peds_pendo_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE peds_pendo_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS peds_pem_tenant_isolation ON peds_pendo_metrics;
CREATE POLICY peds_pem_tenant_isolation ON peds_pendo_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));