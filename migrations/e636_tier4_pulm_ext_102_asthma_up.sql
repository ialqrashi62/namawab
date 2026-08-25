-- TIER4_PULM_EXT-102 Asthma
CREATE TABLE IF NOT EXISTS tier4_pulm_ext_102_asthma (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  classification TEXT,
  target_step INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_ext_102_asthma ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_ext_102_asthma FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_ext_102_asthma_isolation ON tier4_pulm_ext_102_asthma;
CREATE POLICY tier4_pulm_ext_102_asthma_isolation ON tier4_pulm_ext_102_asthma
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));