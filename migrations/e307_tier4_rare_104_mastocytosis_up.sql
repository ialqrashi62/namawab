-- e307 TIER4_RARE-104 Mastocytosis UP
CREATE TABLE IF NOT EXISTS rare_mastocytosis_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  diagnosis VARCHAR(30),
  tryptase_ng_ml NUMERIC(6,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rare_mastocytosis_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_mastocytosis_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_mtm_tenant_isolation ON rare_mastocytosis_metrics;
CREATE POLICY rare_mtm_tenant_isolation ON rare_mastocytosis_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));