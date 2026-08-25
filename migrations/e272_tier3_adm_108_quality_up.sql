-- e272 TIER3_ADM-108 Quality Improvement UP
CREATE TABLE IF NOT EXISTS adm_quality_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  metric_name VARCHAR(60),
  reporting_period VARCHAR(20),
  numerator INTEGER,
  denominator INTEGER,
  rate_pct NUMERIC(6,2),
  benchmark_source VARCHAR(40),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE adm_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_quality_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_qm_tenant_isolation ON adm_quality_metrics;
CREATE POLICY adm_qm_tenant_isolation ON adm_quality_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS adm_capa_log (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  capa_id VARCHAR(50) UNIQUE NOT NULL,
  nonconformance TEXT,
  root_cause TEXT,
  capa_type VARCHAR(20),
  owner VARCHAR(60),
  due_date DATE,
  status VARCHAR(20),
  closure_date DATE
);
ALTER TABLE adm_capa_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_capa_log FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_capa_tenant_isolation ON adm_capa_log;
CREATE POLICY adm_capa_tenant_isolation ON adm_capa_log
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));