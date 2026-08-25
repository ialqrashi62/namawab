-- e174 TIER3_HEMONC-304 Solid Tumor UP
CREATE TABLE IF NOT EXISTS solid_tumor_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  tumor_type VARCHAR(50),
  t_stage VARCHAR(5),
  n_stage VARCHAR(5),
  m_stage VARCHAR(5),
  overall_stage VARCHAR(10),
  ecog_status INTEGER,
  targeted_therapy_eligible BOOLEAN,
  diagnosed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE solid_tumor_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE solid_tumor_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS st_r_tenant_isolation ON solid_tumor_records;
CREATE POLICY st_r_tenant_isolation ON solid_tumor_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));