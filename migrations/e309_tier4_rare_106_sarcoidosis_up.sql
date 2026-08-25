-- e309 TIER4_RARE-106 Sarcoidosis UP
CREATE TABLE IF NOT EXISTS rare_sarc_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  organ_count INTEGER,
  scadding_stage VARCHAR(5),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rare_sarc_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_sarc_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_sm_tenant_isolation ON rare_sarc_metrics;
CREATE POLICY rare_sm_tenant_isolation ON rare_sarc_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));