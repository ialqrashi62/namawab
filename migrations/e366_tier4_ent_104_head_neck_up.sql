-- e366 TIER4_ENT-104 Head Neck UP
CREATE TABLE IF NOT EXISTS ent_hn_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  cancer_type VARCHAR(30),
  t_stage INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ent_hn_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_hn_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ent_hn_tenant_isolation ON ent_hn_metrics;
CREATE POLICY ent_hn_tenant_isolation ON ent_hn_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));