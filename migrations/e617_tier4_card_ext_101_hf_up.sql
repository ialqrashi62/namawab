-- TIER4_CARD_EXT-101 HF
CREATE TABLE IF NOT EXISTS tier4_card_ext_101_hf (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  lvef INT,
  nyha INT,
  hf_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_card_ext_101_hf ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_card_ext_101_hf FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_card_ext_101_hf_isolation ON tier4_card_ext_101_hf;
CREATE POLICY tier4_card_ext_101_hf_isolation ON tier4_card_ext_101_hf
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));