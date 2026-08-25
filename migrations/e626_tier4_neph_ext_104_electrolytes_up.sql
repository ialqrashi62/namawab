-- TIER4_NEPH_EXT-104 Electrolytes
CREATE TABLE IF NOT EXISTS tier4_neph_ext_104_electrolytes (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  na INT,
  k NUMERIC,
  interpretation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_ext_104_electrolytes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_ext_104_electrolytes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_ext_104_electrolytes_isolation ON tier4_neph_ext_104_electrolytes;
CREATE POLICY tier4_neph_ext_104_electrolytes_isolation ON tier4_neph_ext_104_electrolytes
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));