-- TIER4_CARD_EXT-103 Valve
CREATE TABLE IF NOT EXISTS tier4_card_ext_103_valve (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  severity TEXT,
  intervention TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_card_ext_103_valve ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_card_ext_103_valve FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_card_ext_103_valve_isolation ON tier4_card_ext_103_valve;
CREATE POLICY tier4_card_ext_103_valve_isolation ON tier4_card_ext_103_valve
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));