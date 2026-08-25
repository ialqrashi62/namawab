-- e344 TIER4_ORTHO-107 Peds Ortho UP
CREATE TABLE IF NOT EXISTS ortho_peds_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  diagnosis VARCHAR(30),
  age_months INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ortho_peds_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortho_peds_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ortho_pd_tenant_isolation ON ortho_peds_metrics;
CREATE POLICY ortho_pd_tenant_isolation ON ortho_peds_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));