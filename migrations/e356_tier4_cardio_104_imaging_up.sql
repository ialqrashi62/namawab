-- e356 TIER4_CARDIO-104 Imaging UP
CREATE TABLE IF NOT EXISTS cardio_img_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  modality VARCHAR(20),
  calcium_score INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE cardio_img_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_img_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_ig_tenant_isolation ON cardio_img_metrics;
CREATE POLICY cardio_ig_tenant_isolation ON cardio_img_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));