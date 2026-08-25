-- e331 TIER4_OBGYN-102 L&D UP
CREATE TABLE IF NOT EXISTS obgyn_ld_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  bishop_score INTEGER,
  fhr_category VARCHAR(20),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE obgyn_ld_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE obgyn_ld_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_lm_tenant_isolation ON obgyn_ld_metrics;
CREATE POLICY obgyn_lm_tenant_isolation ON obgyn_ld_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));