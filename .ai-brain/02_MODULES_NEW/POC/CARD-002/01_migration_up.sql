<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
-- CARD-002 Migration UP — 12 tables
-- Generated: 2026-07-24 (L1 DRAFT)
-- Reference: SNIPPETS.md#SNIP-02 for RLS pattern

BEGIN;

-- =============================================
-- 1. cardiac_cath_procedures
-- =============================================
CREATE TABLE cardiac_cath_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  encounter_id BIGINT,
  procedure_type VARCHAR(50) NOT NULL,
  indication TEXT,
  urgency VARCHAR(20) NOT NULL,
  access_route VARCHAR(20),
  sheath_size_fr SMALLINT,
  door_time TIMESTAMPTZ,
  balloon_time TIMESTAMPTZ,
  d2b_minutes INT,
  d2b_compliant BOOLEAN,
  d2b_exception_reason VARCHAR(100),
  operator_user_id BIGINT NOT NULL,
  assistant_user_id BIGINT,
  scrub_tech_user_id BIGINT,
  circulating_rn_user_id BIGINT,
  anesthesiologist_user_id BIGINT,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  findings_encrypted BYTEA,
  complications JSONB,
  cpt_codes JSONB,
  nphies_claim_id VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id BIGINT,
  updated_by_user_id BIGINT,
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE cardiac_cath_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardiac_cath_procedures FORCE ROW LEVEL SECURITY;
CREATE POLICY cardiac_cath_procedures_tenant ON cardiac_cath_procedures
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE INDEX idx_cath_proc_tenant_patient ON cardiac_cath_procedures(tenant_id, patient_id) WHERE soft_deleted_at IS NULL;
CREATE INDEX idx_cath_proc_status_time ON cardiac_cath_procedures(tenant_id, status, door_time) WHERE soft_deleted_at IS NULL;
CREATE INDEX idx_cath_proc_operator ON cardiac_cath_procedures(tenant_id, operator_user_id, door_time) WHERE soft_deleted_at IS NULL;

-- =============================================
-- 2. pci_records
-- =============================================
CREATE TABLE pci_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  procedure_id UUID NOT NULL REFERENCES cardiac_cath_procedures(id),
  lesion_count SMALLINT,
  lesions JSONB,
  syntax_score INT,
  syntax_score_band VARCHAR(20),
  grace_score INT,
  timi_score SMALLINT,
  pre_timi_flow SMALLINT,
  post_timi_flow SMALLINT,
  residual_stenosis_pct NUMERIC(5,2),
  devices JSONB,
  final_pressure_atm NUMERIC(5,2),
  dapt_score SMALLINT,
  bleeding_risk_score NUMERIC(5,2),
  operator_cosign_user_id BIGINT,
  assistant_cosign_user_id BIGINT,
  dapt_2md_cosign JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id BIGINT,
  updated_by_user_id BIGINT,
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE pci_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pci_records FORCE ROW LEVEL SECURITY;
CREATE POLICY pci_records_tenant ON pci_records
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE INDEX idx_pci_tenant_proc ON pci_records(tenant_id, procedure_id) WHERE soft_deleted_at IS NULL;

-- =============================================
-- 3. stent_registry (SFDA, lifetime retention)
-- =============================================
CREATE TABLE stent_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  procedure_id UUID NOT NULL REFERENCES cardiac_cath_procedures(id),
  pci_record_id UUID REFERENCES pci_records(id),
  patient_id BIGINT NOT NULL,
  udi VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  size_diameter_mm NUMERIC(4,2),
  length_mm SMALLINT,
  batch_lot VARCHAR(50) NOT NULL,
  expiration_date DATE,
  vessel VARCHAR(20),
  segment VARCHAR(50),
  deployment_pressure_atm NUMERIC(5,2),
  post_dilation BOOLEAN,
  sfda_reported_at TIMESTAMPTZ,
  sfda_report_id VARCHAR(100),
  implanted_at TIMESTAMPTZ NOT NULL,
  operator_user_id BIGINT,
  assistant_user_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id BIGINT,
  updated_by_user_id BIGINT,
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE stent_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE stent_registry FORCE ROW LEVEL SECURITY;
CREATE POLICY stent_registry_tenant ON stent_registry
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE INDEX idx_stent_tenant_patient ON stent_registry(tenant_id, patient_id);

-- =============================================
-- 4. structural_heart_mdt
-- =============================================
CREATE TABLE structural_heart_mdt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  referral_id UUID,
  mdt_date TIMESTAMPTZ,
  indication VARCHAR(50),
  members_present JSONB,
  sts_score NUMERIC(5,2),
  frailty_score NUMERIC(5,2),
  euroscore_ii NUMERIC(5,2),
  recommendation TEXT,
  recommendation_alternatives JSONB,
  patient_consent_summary TEXT,
  decided_by JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  nphies_preauth_id VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id BIGINT,
  updated_by_user_id BIGINT,
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE structural_heart_mdt ENABLE ROW LEVEL SECURITY;
ALTER TABLE structural_heart_mdt FORCE ROW LEVEL SECURITY;
CREATE POLICY structural_heart_mdt_tenant ON structural_heart_mdt
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- =============================================
-- 5. tavr_workup
-- =============================================
CREATE TABLE tavr_workup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  mdt_id UUID REFERENCES structural_heart_mdt(id),
  ct_annular_area_mm2 NUMERIC(7,2),
  ct_annular_perimeter_mm NUMERIC(7,2),
  valve_calcification_score NUMERIC(5,2),
  access_route_planned VARCHAR(10),
  valve_size_predicted VARCHAR(20),
  valve_type_planned VARCHAR(50),
  coronary_height_mm NUMERIC(6,2),
  aortic_root_dims JSONB,
  frailty_assessment JSONB,
  dental_clearance BOOLEAN,
  pulm_clearance BOOLEAN,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id BIGINT,
  updated_by_user_id BIGINT,
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE tavr_workup ENABLE ROW LEVEL SECURITY;
ALTER TABLE tavr_workup FORCE ROW LEVEL SECURITY;
CREATE POLICY tavr_workup_tenant ON tavr_workup
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- =============================================
-- 6. cath_lab_scheduling
-- =============================================
CREATE TABLE cath_lab_scheduling (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  facility_id UUID,
  room_id VARCHAR(20),
  scheduled_date DATE,
  slot_start TIMESTAMPTZ,
  slot_end TIMESTAMPTZ,
  procedure_type VARCHAR(50),
  operator_user_id BIGINT,
  estimated_duration_min INT,
  equipment_ids JSONB,
  status VARCHAR(20) DEFAULT 'scheduled',
  conflict_check BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id BIGINT,
  updated_by_user_id BIGINT,
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE cath_lab_scheduling ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_lab_scheduling FORCE ROW LEVEL SECURITY;
CREATE POLICY cath_lab_scheduling_tenant ON cath_lab_scheduling
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- =============================================
-- 7. contrast_tracking
-- =============================================
CREATE TABLE contrast_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  procedure_id UUID REFERENCES cardiac_cath_procedures(id),
  contrast_agent VARCHAR(50),
  contrast_volume_ml INT,
  cumulative_30day_ml INT,
  baseline_egfr NUMERIC(6,2),
  post_egfr_48h NUMERIC(6,2),
  cin_event BOOLEAN,
  hydration_protocol VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE contrast_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE contrast_tracking FORCE ROW LEVEL SECURITY;
CREATE POLICY contrast_tracking_tenant ON contrast_tracking
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- =============================================
-- 8. radiation_dose_log
-- =============================================
CREATE TABLE radiation_dose_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  procedure_id UUID REFERENCES cardiac_cath_procedures(id),
  staff_id BIGINT,
  role VARCHAR(20),
  role_dose_mgy NUMERIC(8,2),
  role_dap_gy_cm2 NUMERIC(8,2),
  lead_apron_used BOOLEAN,
  thyroid_shield_used BOOLEAN,
  dosimeter_reading_monthly_mgy NUMERIC(8,2),
  cumulative_ytd_mgy NUMERIC(8,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE radiation_dose_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiation_dose_log FORCE ROW LEVEL SECURITY;
CREATE POLICY radiation_dose_log_tenant ON radiation_dose_log
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- =============================================
-- 9. cath_lab_equipment
-- =============================================
CREATE TABLE cath_lab_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  facility_id UUID,
  equipment_type VARCHAR(50),
  manufacturer VARCHAR(100),
  model VARCHAR(100),
  serial VARCHAR(100),
  install_date DATE,
  last_pm_date DATE,
  next_pm_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  sfda_registration VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE cath_lab_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_lab_equipment FORCE ROW LEVEL SECURITY;
CREATE POLICY cath_lab_equipment_tenant ON cath_lab_equipment
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- =============================================
-- 10. cath_lab_red_flags
-- =============================================
CREATE TABLE cath_lab_red_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  procedure_id UUID REFERENCES cardiac_cath_procedures(id),
  flag_type VARCHAR(50),
  detected_at TIMESTAMPTZ,
  detected_by VARCHAR(20),
  response_action TEXT,
  response_time_seconds INT,
  resolved_at TIMESTAMPTZ,
  audit_critical BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE cath_lab_red_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_lab_red_flags FORCE ROW LEVEL SECURITY;
CREATE POLICY cath_lab_red_flags_tenant ON cath_lab_red_flags
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- =============================================
-- 11. cath_audit_log
-- =============================================
CREATE TABLE cath_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  procedure_id UUID REFERENCES cardiac_cath_procedures(id),
  user_id BIGINT,
  action VARCHAR(100),
  input_hash VARCHAR(64),
  output_hash VARCHAR(64),
  prev_hash VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE cath_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_audit_log FORCE ROW LEVEL SECURITY;
CREATE POLICY cath_audit_log_tenant ON cath_audit_log
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
CREATE INDEX idx_cath_audit_tenant_proc ON cath_audit_log(tenant_id, procedure_id);

-- =============================================
-- 12. cath_consent
-- =============================================
CREATE TABLE cath_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  procedure_id UUID REFERENCES cardiac_cath_procedures(id),
  consent_type VARCHAR(50),
  consent_text_ar TEXT,
  consent_text_en TEXT,
  signed_at TIMESTAMPTZ,
  signed_by BIGINT,
  witness_id BIGINT,
  interpreter_used BOOLEAN,
  ai_assisted_care_consent BOOLEAN,
  withdrawal_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);

ALTER TABLE cath_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE cath_consent FORCE ROW LEVEL SECURITY;
CREATE POLICY cath_consent_tenant ON cath_consent
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

COMMIT;

-- Force RLS count: was 150, now 162 (CARD-002 adds 12)