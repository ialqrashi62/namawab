-- e345 TIER4_ORTHO-108 Ortho Onc UP
CREATE TABLE IF NOT EXISTS ortho_onc_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  diagnosis VARCHAR(30),
  lodwick VARCHAR(20),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ortho_onc_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortho_onc_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ortho_oc_tenant_isolation ON ortho_onc_metrics;
CREATE POLICY ortho_oc_tenant_isolation ON ortho_onc_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));