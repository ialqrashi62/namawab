-- e351 TIER4_NEURO-107 Neuroimmunology UP
CREATE TABLE IF NOT EXISTS neuro_immuno_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  antibody VARCHAR(30),
  diagnosis VARCHAR(30),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE neuro_immuno_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_immuno_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_im_tenant_isolation ON neuro_immuno_metrics;
CREATE POLICY neuro_im_tenant_isolation ON neuro_immuno_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));