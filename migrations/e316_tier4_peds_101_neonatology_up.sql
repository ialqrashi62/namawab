-- e316 TIER4_PEDS-101 Neonatology UP
CREATE TABLE IF NOT EXISTS peds_nicu_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  ga_weeks INTEGER,
  birth_weight_g INTEGER,
  apgar_5min INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE peds_nicu_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE peds_nicu_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS peds_nm_tenant_isolation ON peds_nicu_metrics;
CREATE POLICY peds_nm_tenant_isolation ON peds_nicu_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));