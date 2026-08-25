-- TIER4_GI_EXT-104 Cirrhosis
CREATE TABLE IF NOT EXISTS tier4_gi_ext_104_cirrhosis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  meld NUMERIC,
  decompensation BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_ext_104_cirrhosis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_ext_104_cirrhosis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_ext_104_cirrhosis_isolation ON tier4_gi_ext_104_cirrhosis;
CREATE POLICY tier4_gi_ext_104_cirrhosis_isolation ON tier4_gi_ext_104_cirrhosis
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));