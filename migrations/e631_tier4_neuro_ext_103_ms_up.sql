-- TIER4_NEURO_EXT-103 MS
CREATE TABLE IF NOT EXISTS tier4_neuro_ext_103_ms (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  attacks INT,
  ms_diagnosis BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neuro_ext_103_ms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neuro_ext_103_ms FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neuro_ext_103_ms_isolation ON tier4_neuro_ext_103_ms;
CREATE POLICY tier4_neuro_ext_103_ms_isolation ON tier4_neuro_ext_103_ms
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));