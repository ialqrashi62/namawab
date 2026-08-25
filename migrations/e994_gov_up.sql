-- filepath: migrations/e994_gov_up.sql
-- TIER9_GOV_EXT 101-106 governance tables

CREATE TABLE IF NOT EXISTS tier9_gov_policy (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  policy_id TEXT,
  version_number TEXT,
  severity TEXT,
  category TEXT,
  maturity TEXT,
  ack_status TEXT,
  retire_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier9_gov_policy ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier9_gov_policy FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier9_gov_policy_tenant ON tier9_gov_policy;
CREATE POLICY tier9_gov_policy_tenant ON tier9_gov_policy USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier9_gov_policy_tenant_idx ON tier9_gov_policy (tenant_id, category, created_at DESC);

CREATE TABLE IF NOT EXISTS tier9_gov_risk (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  risk_id TEXT,
  category TEXT,
  score INTEGER,
  band TEXT,
  effectiveness TEXT,
  treatment_feasibility TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier9_gov_risk ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier9_gov_risk FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier9_gov_risk_tenant ON tier9_gov_risk;
CREATE POLICY tier9_gov_risk_tenant ON tier9_gov_risk USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier9_gov_risk_tenant_idx ON tier9_gov_risk (tenant_id, band, created_at DESC);

CREATE TABLE IF NOT EXISTS tier9_gov_incident (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  incident_id TEXT,
  category TEXT,
  severity TEXT,
  urgency TEXT,
  capa_status TEXT,
  action_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier9_gov_incident ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier9_gov_incident FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier9_gov_incident_tenant ON tier9_gov_incident;
CREATE POLICY tier9_gov_incident_tenant ON tier9_gov_incident USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier9_gov_incident_tenant_idx ON tier9_gov_incident (tenant_id, severity, created_at DESC);

CREATE TABLE IF NOT EXISTS tier9_gov_audit (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  audit_id TEXT,
  audit_type TEXT,
  status TEXT,
  findings_count INTEGER,
  execution_status TEXT,
  format_quality TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier9_gov_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier9_gov_audit FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier9_gov_audit_tenant ON tier9_gov_audit;
CREATE POLICY tier9_gov_audit_tenant ON tier9_gov_audit USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier9_gov_audit_tenant_idx ON tier9_gov_audit (tenant_id, audit_type, created_at DESC);

CREATE TABLE IF NOT EXISTS tier9_gov_privacy (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  subject_id TEXT,
  consent_type TEXT,
  consent_validity TEXT,
  breach_severity TEXT,
  dpia_risk TEXT,
  compliance_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier9_gov_privacy ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier9_gov_privacy FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier9_gov_privacy_tenant ON tier9_gov_privacy;
CREATE POLICY tier9_gov_privacy_tenant ON tier9_gov_privacy USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier9_gov_privacy_tenant_idx ON tier9_gov_privacy (tenant_id, consent_type, created_at DESC);

CREATE TABLE IF NOT EXISTS tier9_gov_compliance (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  submission_id TEXT,
  regulator TEXT,
  standard TEXT,
  accreditation_band TEXT,
  submission_status TEXT,
  followup_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier9_gov_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier9_gov_compliance FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier9_gov_compliance_tenant ON tier9_gov_compliance;
CREATE POLICY tier9_gov_compliance_tenant ON tier9_gov_compliance USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier9_gov_compliance_tenant_idx ON tier9_gov_compliance (tenant_id, regulator, created_at DESC);