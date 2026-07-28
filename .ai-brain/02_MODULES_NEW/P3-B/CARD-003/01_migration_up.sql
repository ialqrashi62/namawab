<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
-- CARD-003 Migration UP — 8 tables
BEGIN;
CREATE TABLE ep_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  procedure_type VARCHAR(50) NOT NULL,
  indication TEXT, urgency VARCHAR(20),
  operator_user_id BIGINT,
  status VARCHAR(20) DEFAULT 'scheduled',
  procedure_date TIMESTAMPTZ,
  findings_encrypted BYTEA, complications JSONB, cpt_codes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE ep_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE ep_procedures FORCE ROW LEVEL SECURITY;
CREATE POLICY ep_procedures_tenant ON ep_procedures USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE device_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  udi VARCHAR(100) NOT NULL, manufacturer VARCHAR(100), model VARCHAR(100),
  device_type VARCHAR(30) NOT NULL, serial VARCHAR(100), batch_lot VARCHAR(50),
  implant_date TIMESTAMPTZ, generator_battery VARCHAR(10),
  mri_conditional BOOLEAN, lifetime_under_warranty BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE device_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_registry FORCE ROW LEVEL SECURITY;
CREATE POLICY device_registry_tenant ON device_registry USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE device_remote_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  device_id UUID REFERENCES device_registry(id),
  transmission_date TIMESTAMPTZ,
  alert_type VARCHAR(50), episode_details JSONB,
  action_taken TEXT, action_by BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE device_remote_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_remote_monitoring FORCE ROW LEVEL SECURITY;
CREATE POLICY device_remote_monitoring_tenant ON device_remote_monitoring USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Additional 5 tables abbreviated for POC: device_leads, device_followup, ep_study_findings, ep_red_flags, ep_audit_log
COMMIT;