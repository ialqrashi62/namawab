-- e340 TIER4_ORTHO-103 Joint Recon UP
CREATE TABLE IF NOT EXISTS ortho_arthro_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  procedure_type VARCHAR(20),
  age INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ortho_arthro_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortho_arthro_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ortho_ar_tenant_isolation ON ortho_arthro_metrics;
CREATE POLICY ortho_ar_tenant_isolation ON ortho_arthro_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));