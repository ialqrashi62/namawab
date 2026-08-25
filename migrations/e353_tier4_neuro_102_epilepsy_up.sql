-- e353 TIER4_NEURO-102 Epilepsy UP
CREATE TABLE IF NOT EXISTS neuro_epi_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  seizure_type VARCHAR(30),
  syndrome VARCHAR(30),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE neuro_epi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_epi_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_ep_tenant_isolation ON neuro_epi_metrics;
CREATE POLICY neuro_ep_tenant_isolation ON neuro_epi_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));