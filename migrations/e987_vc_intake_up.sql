-- filepath: migrations/e987_vc_intake_up.sql
-- TIER6_VC_EXT-101 Virtual care intake table
CREATE TABLE IF NOT EXISTS tier6_vc_intake (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT NOT NULL,
  readiness TEXT,
  language TEXT,
  modality TEXT,
  severity TEXT,
  complaint TEXT,
  completeness TEXT,
  equipment_band TEXT,
  risk_band TEXT,
  identity_verified BOOLEAN,
  consent_to_telehealth BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier6_vc_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier6_vc_intake FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier6_vc_intake_tenant ON tier6_vc_intake;
CREATE POLICY tier6_vc_intake_tenant ON tier6_vc_intake
  USING tenant_id::text = current_setting('app.tenant_id', true);
CREATE INDEX IF NOT EXISTS tier6_vc_intake_tenant_idx ON tier6_vc_intake (tenant_id, created_at DESC);

-- TIER6_VC_EXT-102 Virtual care visit table
CREATE TABLE IF NOT EXISTS tier6_vc_visit (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT NOT NULL,
  provider_id TEXT,
  visit_id TEXT,
  scheduling TEXT,
  modality TEXT,
  quality TEXT,
  recording_policy TEXT,
  epcs_action TEXT,
  follow_up_plan TEXT,
  duration_days INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier6_vc_visit ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier6_vc_visit FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier6_vc_visit_tenant ON tier6_vc_visit;
CREATE POLICY tier6_vc_visit_tenant ON tier6_vc_visit
  USING tenant_id::text = current_setting('app.tenant_id', true);
CREATE INDEX IF NOT EXISTS tier6_vc_visit_tenant_idx ON tier6_vc_visit (tenant_id, created_at DESC);