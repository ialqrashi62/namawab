-- TIER4_OBGYN_EXT-103 Ectopic
CREATE TABLE IF NOT EXISTS tier4_obgyn_ext_103_ectopic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  hcg NUMERIC,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_obgyn_ext_103_ectopic ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_obgyn_ext_103_ectopic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_obgyn_ext_103_ectopic_isolation ON tier4_obgyn_ext_103_ectopic;
CREATE POLICY tier4_obgyn_ext_103_ectopic_isolation ON tier4_obgyn_ext_103_ectopic
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));