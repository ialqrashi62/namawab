-- e355 TIER4_CARDIO-103 Interventional UP
CREATE TABLE IF NOT EXISTS cardio_int_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  procedure_type VARCHAR(30),
  syntax_score INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE cardio_int_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_int_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_it_tenant_isolation ON cardio_int_metrics;
CREATE POLICY cardio_it_tenant_isolation ON cardio_int_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));