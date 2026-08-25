-- e342 TIER4_ORTHO-105 Hand UP
CREATE TABLE IF NOT EXISTS ortho_hand_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  diagnosis VARCHAR(30),
  bctq_score NUMERIC(4,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ortho_hand_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortho_hand_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ortho_hd_tenant_isolation ON ortho_hand_metrics;
CREATE POLICY ortho_hd_tenant_isolation ON ortho_hand_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));