-- e346 TIER4_NEURO-101 Stroke UP
CREATE TABLE IF NOT EXISTS neuro_stroke_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  nihss INTEGER,
  etiology VARCHAR(30),
  ich_volume_ml NUMERIC(6,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE neuro_stroke_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_stroke_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_st_tenant_isolation ON neuro_stroke_metrics;
CREATE POLICY neuro_st_tenant_isolation ON neuro_stroke_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));