-- filepath: migrations/e991_vc_behavioral_up.sql
-- TIER6_VC_EXT-106 Behavioral health PHQ-9 table
CREATE TABLE IF NOT EXISTS tier6_vc_phq9 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT NOT NULL,
  total INTEGER,
  band TEXT,
  suicidality_flag BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier6_vc_phq9 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier6_vc_phq9 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier6_vc_phq9_tenant ON tier6_vc_phq9;
CREATE POLICY tier6_vc_phq9_tenant ON tier6_vc_phq9
  USING tenant_id::text = current_setting('app.tenant_id', true);
CREATE INDEX IF NOT EXISTS tier6_vc_phq9_tenant_idx ON tier6_vc_phq9 (tenant_id, patient_id, created_at DESC);

-- TIER6_VC_EXT-106 BH crisis table
CREATE TABLE IF NOT EXISTS tier6_vc_bh_crisis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT NOT NULL,
  crisis_type TEXT,
  means_available BOOLEAN,
  crisis_action TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier6_vc_bh_crisis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier6_vc_bh_crisis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier6_vc_bh_crisis_tenant ON tier6_vc_bh_crisis;
CREATE POLICY tier6_vc_bh_crisis_tenant ON tier6_vc_bh_crisis
  USING tenant_id::text = current_setting('app.tenant_id', true);
CREATE INDEX IF NOT EXISTS tier6_vc_bh_crisis_tenant_idx ON tier6_vc_bh_crisis (tenant_id, crisis_type, created_at DESC);