-- filepath: migrations/e990_vc_chronic_up.sql
-- TIER6_VC_EXT-105 CCM enrollment table
CREATE TABLE IF NOT EXISTS tier6_vc_ccm (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT NOT NULL,
  chronic_conditions_count INTEGER,
  consent_to_ccm BOOLEAN,
  care_coordinator_role TEXT,
  eligibility TEXT,
  plan_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier6_vc_ccm ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier6_vc_ccm FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier6_vc_ccm_tenant ON tier6_vc_ccm;
CREATE POLICY tier6_vc_ccm_tenant ON tier6_vc_ccm
  USING tenant_id::text = current_setting('app.tenant_id', true);
CREATE INDEX IF NOT EXISTS tier6_vc_ccm_tenant_idx ON tier6_vc_ccm (tenant_id, patient_id, created_at DESC);

-- TIER6_VC_EXT-105 CCM outcomes table
CREATE TABLE IF NOT EXISTS tier6_vc_ccm_outcomes (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT NOT NULL,
  days_in_program INTEGER,
  ed_visits_pre INTEGER,
  ed_visits_post INTEGER,
  hba1c_pre DOUBLE PRECISION,
  hba1c_post DOUBLE PRECISION,
  bp_systolic_pre DOUBLE PRECISION,
  bp_systolic_post DOUBLE PRECISION,
  outcome_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier6_vc_ccm_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier6_vc_ccm_outcomes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier6_vc_ccm_outcomes_tenant ON tier6_vc_ccm_outcomes;
CREATE POLICY tier6_vc_ccm_outcomes_tenant ON tier6_vc_ccm_outcomes
  USING tenant_id::text = current_setting('app.tenant_id', true);
CREATE INDEX IF NOT EXISTS tier6_vc_ccm_outcomes_tenant_idx ON tier6_vc_ccm_outcomes (tenant_id, patient_id, created_at DESC);