-- TIER5_INTEG_EXT-106 Care Transitions
CREATE TABLE IF NOT EXISTS tier5_integ_ext_106_caretrans (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  complete BOOLEAN,
  facility_to TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_integ_ext_106_caretrans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_integ_ext_106_caretrans FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_integ_ext_106_caretrans_isolation ON tier5_integ_ext_106_caretrans;
CREATE POLICY tier5_integ_ext_106_caretrans_isolation ON tier5_integ_ext_106_caretrans
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));