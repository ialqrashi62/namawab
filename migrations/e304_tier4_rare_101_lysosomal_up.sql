-- e304 TIER4_RARE-101 Lysosomal UP
CREATE TABLE IF NOT EXISTS rare_lysosomal_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  disease VARCHAR(30),
  severity VARCHAR(20),
  on_ert BOOLEAN,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rare_lysosomal_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_lysosomal_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_lm_tenant_isolation ON rare_lysosomal_metrics;
CREATE POLICY rare_lm_tenant_isolation ON rare_lysosomal_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));