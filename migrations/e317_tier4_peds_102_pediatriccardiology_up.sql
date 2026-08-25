-- e317 TIER4_PEDS-102 Pediatric Cardiology UP
CREATE TABLE IF NOT EXISTS peds_pcard_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  age_years INTEGER,
  coronary_z_max NUMERIC(4,2),
  diagnosis VARCHAR(50),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE peds_pcard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE peds_pcard_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS peds_pcm_tenant_isolation ON peds_pcard_metrics;
CREATE POLICY peds_pcm_tenant_isolation ON peds_pcard_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));