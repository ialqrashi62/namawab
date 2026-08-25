-- e336 TIER4_OBGYN-107 Menopause UP
CREATE TABLE IF NOT EXISTS obgyn_meno_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  age INTEGER,
  on_mht BOOLEAN,
  dexa_t NUMERIC(4,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE obgyn_meno_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE obgyn_meno_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_me_tenant_isolation ON obgyn_meno_metrics;
CREATE POLICY obgyn_me_tenant_isolation ON obgyn_meno_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));