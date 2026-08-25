-- e282 TIER3_ONC-102 Tumor Markers UP
CREATE TABLE IF NOT EXISTS onc_tumor_markers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  marker_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  marker_name VARCHAR(30),
  marker_value NUMERIC(10,2),
  reference_range VARCHAR(30),
  clinical_context VARCHAR(60),
  interpretation VARCHAR(60),
  drawn_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE onc_tumor_markers ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_tumor_markers FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS onc_tm_tenant_isolation ON onc_tumor_markers;
CREATE POLICY onc_tm_tenant_isolation ON onc_tumor_markers
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));