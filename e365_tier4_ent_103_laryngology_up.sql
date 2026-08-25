-- e365 TIER4_ENT-103 Laryngology UP
CREATE TABLE IF NOT EXISTS ent_laryng_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  diagnosis VARCHAR(30),
  weight_loss_kg NUMERIC(4,1),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ent_laryng_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_laryng_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ent_ly_tenant_isolation ON ent_laryng_metrics;
CREATE POLICY ent_ly_tenant_isolation ON ent_laryng_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));