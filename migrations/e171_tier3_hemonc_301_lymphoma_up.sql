-- e171 TIER3_HEMONC-301 Lymphoma UP
CREATE TABLE IF NOT EXISTS lymphoma_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  classification VARCHAR(50),
  ann_arbor_stage VARCHAR(10),
  bulky_disease BOOLEAN,
  ipi_risk VARCHAR(30),
  regimen TEXT,
  response VARCHAR(50),
  diagnosed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE lymphoma_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE lymphoma_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lymph_r_tenant_isolation ON lymphoma_records;
CREATE POLICY lymph_r_tenant_isolation ON lymphoma_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));