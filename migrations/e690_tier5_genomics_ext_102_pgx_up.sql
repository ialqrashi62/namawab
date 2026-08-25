-- TIER5_GENOMICS_EXT-102 PGx
CREATE TABLE IF NOT EXISTS tier5_genomics_ext_102_pgx (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  drug TEXT,
  dose_mg NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_genomics_ext_102_pgx ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_genomics_ext_102_pgx FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_genomics_ext_102_pgx_isolation ON tier5_genomics_ext_102_pgx;
CREATE POLICY tier5_genomics_ext_102_pgx_isolation ON tier5_genomics_ext_102_pgx
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));