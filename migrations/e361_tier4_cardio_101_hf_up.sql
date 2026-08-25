-- e361 TIER4_CARDIO-101 HF UP
CREATE TABLE IF NOT EXISTS cardio_hf_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  lvef INTEGER,
  nyha INTEGER,
  phenotype VARCHAR(20),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE cardio_hf_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_hf_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_cf_tenant_isolation ON cardio_hf_metrics;
CREATE POLICY cardio_cf_tenant_isolation ON cardio_hf_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));