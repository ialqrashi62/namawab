-- TIER5_INTEG_EXT-103 HL7
CREATE TABLE IF NOT EXISTS tier5_integ_ext_103_hl7 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  message_type TEXT,
  segments_count INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_integ_ext_103_hl7 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_integ_ext_103_hl7 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_integ_ext_103_hl7_isolation ON tier5_integ_ext_103_hl7;
CREATE POLICY tier5_integ_ext_103_hl7_isolation ON tier5_integ_ext_103_hl7
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));