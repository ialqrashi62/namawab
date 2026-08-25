-- TIER4_CARD_EXT-102 Arrhythmia
CREATE TABLE IF NOT EXISTS tier4_card_ext_102_arrhythmia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  cha2ds2vasc INT,
  anticoag_indicated BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_card_ext_102_arrhythmia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_card_ext_102_arrhythmia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_card_ext_102_arrhythmia_isolation ON tier4_card_ext_102_arrhythmia;
CREATE POLICY tier4_card_ext_102_arrhythmia_isolation ON tier4_card_ext_102_arrhythmia
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));