-- TIER4_ENDO_EXT-104 Pheo
CREATE TABLE IF NOT EXISTS tier4_endo_ext_104_pheo (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  plasma_metanephrine NUMERIC,
  positive_screen BOOLEAN,
  ready_for_surgery BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_ext_104_pheo ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_ext_104_pheo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_ext_104_pheo_isolation ON tier4_endo_ext_104_pheo;
CREATE POLICY tier4_endo_ext_104_pheo_isolation ON tier4_endo_ext_104_pheo
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));