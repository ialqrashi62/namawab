-- e350 TIER4_NEURO-106 Dementia UP
CREATE TABLE IF NOT EXISTS neuro_dementia_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  diagnosis VARCHAR(30),
  mmse INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE neuro_dementia_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_dementia_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_dm_tenant_isolation ON neuro_dementia_metrics;
CREATE POLICY neuro_dm_tenant_isolation ON neuro_dementia_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));