-- e323 TIER4_PEDS-108 Adolescent UP
CREATE TABLE IF NOT EXISTS peds_adol_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  age_years INTEGER,
  bmi NUMERIC(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE peds_adol_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE peds_adol_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS peds_pam_tenant_isolation ON peds_adol_metrics;
CREATE POLICY peds_pam_tenant_isolation ON peds_adol_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));