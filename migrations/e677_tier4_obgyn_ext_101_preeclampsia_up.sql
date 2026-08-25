-- TIER4_OBGYN_EXT-101 Preeclampsia
CREATE TABLE IF NOT EXISTS tier4_obgyn_ext_101_preeclampsia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  sbp INT,
  severity TEXT,
  mg_indicated BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_obgyn_ext_101_preeclampsia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_obgyn_ext_101_preeclampsia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_obgyn_ext_101_preeclampsia_isolation ON tier4_obgyn_ext_101_preeclampsia;
CREATE POLICY tier4_obgyn_ext_101_preeclampsia_isolation ON tier4_obgyn_ext_101_preeclampsia
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));