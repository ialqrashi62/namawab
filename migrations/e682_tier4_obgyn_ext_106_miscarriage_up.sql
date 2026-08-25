-- TIER4_OBGYN_EXT-106 Miscarriage
CREATE TABLE IF NOT EXISTS tier4_obgyn_ext_106_miscarriage (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  type TEXT,
  management TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_obgyn_ext_106_miscarriage ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_obgyn_ext_106_miscarriage FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_obgyn_ext_106_miscarriage_isolation ON tier4_obgyn_ext_106_miscarriage;
CREATE POLICY tier4_obgyn_ext_106_miscarriage_isolation ON tier4_obgyn_ext_106_miscarriage
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));