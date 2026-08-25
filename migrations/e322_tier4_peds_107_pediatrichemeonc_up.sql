-- e322 TIER4_PEDS-107 Pediatric HemeOnc UP
CREATE TABLE IF NOT EXISTS peds_phemeonc_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  age_years INTEGER,
  crisis_type VARCHAR(30),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE peds_phemeonc_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE peds_phemeonc_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS peds_phm_tenant_isolation ON peds_phemeonc_metrics;
CREATE POLICY peds_phm_tenant_isolation ON peds_phemeonc_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));