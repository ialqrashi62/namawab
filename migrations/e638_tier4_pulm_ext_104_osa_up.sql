-- TIER4_PULM_EXT-104 OSA
CREATE TABLE IF NOT EXISTS tier4_pulm_ext_104_osa (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  stop_bang INT,
  ahi INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_ext_104_osa ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_ext_104_osa FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_ext_104_osa_isolation ON tier4_pulm_ext_104_osa;
CREATE POLICY tier4_pulm_ext_104_osa_isolation ON tier4_pulm_ext_104_osa
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));