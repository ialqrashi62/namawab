-- e173 TIER3_HEMONC-303 Myeloma UP
CREATE TABLE IF NOT EXISTS myeloma_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  riss_stage VARCHAR(20),
  cytogenetic_high_risk BOOLEAN,
  on_therapy VARCHAR(100),
  m_protein_reduction_pct NUMERIC(5,2),
  mrd_status VARCHAR(30),
  diagnosed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE myeloma_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE myeloma_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS mm_r_tenant_isolation ON myeloma_records;
CREATE POLICY mm_r_tenant_isolation ON myeloma_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));