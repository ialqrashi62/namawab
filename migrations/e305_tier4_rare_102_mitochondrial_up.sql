-- e305 TIER4_RARE-102 Mitochondrial UP
CREATE TABLE IF NOT EXISTS rare_mitochondrial_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  syndrome VARCHAR(20),
  heteroplasmy_pct NUMERIC(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rare_mitochondrial_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_mitochondrial_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_mm_tenant_isolation ON rare_mitochondrial_metrics;
CREATE POLICY rare_mm_tenant_isolation ON rare_mitochondrial_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));