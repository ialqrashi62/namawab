-- TIER4_NEURO_EXT-104 PD
CREATE TABLE IF NOT EXISTS tier4_neuro_ext_104_pd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  classic_pd BOOLEAN,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neuro_ext_104_pd ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neuro_ext_104_pd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neuro_ext_104_pd_isolation ON tier4_neuro_ext_104_pd;
CREATE POLICY tier4_neuro_ext_104_pd_isolation ON tier4_neuro_ext_104_pd
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));