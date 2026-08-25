-- e315 TIER4_RARE-112 NF UP
CREATE TABLE IF NOT EXISTS rare_nf_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  nf_type VARCHAR(10),
  criteria_count INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rare_nf_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_nf_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_nfm_tenant_isolation ON rare_nf_metrics;
CREATE POLICY rare_nfm_tenant_isolation ON rare_nf_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));