-- e367 TIER4_ENT-105 Pediatric ENT UP
CREATE TABLE IF NOT EXISTS ent_peds_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  diagnosis VARCHAR(30),
  age_months INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ent_peds_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_peds_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ent_pd_tenant_isolation ON ent_peds_metrics;
CREATE POLICY ent_pd_tenant_isolation ON ent_peds_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));