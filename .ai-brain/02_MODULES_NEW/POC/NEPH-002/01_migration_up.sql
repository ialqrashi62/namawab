<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
-- NEPH-002 Migration UP — 13 tables
-- Reference: SNIPPETS.md#SNIP-02 for RLS pattern

BEGIN;

-- 1. transplant_waitlist
CREATE TABLE transplant_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  listing_date TIMESTAMPTZ NOT NULL,
  blood_type VARCHAR(3),
  cpra_pct NUMERIC(5,2),
  epts_score NUMERIC(5,2),
  dialysis_years NUMERIC(5,1),
  diabetes_status BOOLEAN DEFAULT FALSE,
  prior_transplant_count INT DEFAULT 0,
  hla_antibodies JSONB,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  priority_score NUMERIC(6,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id BIGINT,
  updated_by_user_id BIGINT,
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE transplant_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE transplant_waitlist FORCE ROW LEVEL SECURITY;
CREATE POLICY transplant_waitlist_tenant ON transplant_waitlist USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 2. donor_registry
CREATE TABLE donor_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  donor_id VARCHAR(50) NOT NULL,
  donor_type VARCHAR(10) NOT NULL,
  age INT, height_cm INT, weight_kg INT,
  blood_type VARCHAR(3),
  hla_typing JSONB,
  kdpi_score NUMERIC(5,2),
  cause_of_death VARCHAR(100),
  comorbidities JSONB,
  ecmo_used BOOLEAN, dcd BOOLEAN,
  cross_clamp_time TIMESTAMPTZ,
  cold_ischemia_minutes INT,
  biopsy_remuzzi_score JSONB,
  recovered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE donor_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_registry FORCE ROW LEVEL SECURITY;
CREATE POLICY donor_registry_tenant ON donor_registry USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 3. recipient_evaluation
CREATE TABLE recipient_evaluation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  evaluation_date TIMESTAMPTZ NOT NULL,
  cardiac_clearance BOOLEAN, pulmonary_clearance BOOLEAN,
  malignancy_screening BOOLEAN,
  infection_screening JSONB,
  psychosocial_clearance BOOLEAN, financial_clearance BOOLEAN,
  mdt_approval_date TIMESTAMPTZ,
  approved_for_listing BOOLEAN,
  exclusions JSONB,
  evaluated_by_user_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE recipient_evaluation ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipient_evaluation FORCE ROW LEVEL SECURITY;
CREATE POLICY recipient_evaluation_tenant ON recipient_evaluation USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 4. hla_typing
CREATE TABLE hla_typing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  subject_type VARCHAR(10) NOT NULL,
  subject_id BIGINT NOT NULL,
  locus VARCHAR(10) NOT NULL,
  allele_1 VARCHAR(20), allele_2 VARCHAR(20),
  resolution VARCHAR(10) DEFAULT 'HIGH',
  typing_method VARCHAR(20),
  tested_at TIMESTAMPTZ, lab_id VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE hla_typing ENABLE ROW LEVEL SECURITY;
ALTER TABLE hla_typing FORCE ROW LEVEL SECURITY;
CREATE POLICY hla_typing_tenant ON hla_typing USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 5. crossmatch_results
CREATE TABLE crossmatch_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  donor_id BIGINT NOT NULL, recipient_id BIGINT NOT NULL,
  cdc_t_cell VARCHAR(10), cdc_b_cell VARCHAR(10),
  flow_t_cell_mcs NUMERIC(6,1), flow_b_cell_mcs NUMERIC(6,1),
  virtual_xm VARCHAR(10), dsa_locus JSONB,
  performed_at TIMESTAMPTZ, performed_by_user_id BIGINT,
  lab_id VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE crossmatch_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE crossmatch_results FORCE ROW LEVEL SECURITY;
CREATE POLICY crossmatch_results_tenant ON crossmatch_results USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 6. transplant_procedure
CREATE TABLE transplant_procedure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  recipient_id BIGINT NOT NULL, donor_id BIGINT NOT NULL,
  procedure_date TIMESTAMPTZ NOT NULL,
  transplant_type VARCHAR(10),
  cold_ischemia_minutes INT, warm_ischemia_minutes INT,
  vascular_anastomosis_time_min INT, total_ischemia_minutes INT,
  ureteral_stent_placed BOOLEAN, foley_duration_days INT,
  induction_agent VARCHAR(50), induction_dose VARCHAR(100),
  surgeon_id BIGINT, anesthesiologist_id BIGINT,
  estimated_blood_loss_ml INT, complications_intraop TEXT,
  status VARCHAR(20) DEFAULT 'COMPLETED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE transplant_procedure ENABLE ROW LEVEL SECURITY;
ALTER TABLE transplant_procedure FORCE ROW LEVEL SECURITY;
CREATE POLICY transplant_procedure_tenant ON transplant_procedure USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 7. immunosuppression_log (HIGH-ALERT)
CREATE TABLE immunosuppression_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL, encounter_id BIGINT,
  drug_name VARCHAR(50) NOT NULL,
  dose_mg NUMERIC(8,2), frequency VARCHAR(20), route VARCHAR(20),
  trough_level_ng_ml NUMERIC(6,2), trough_date TIMESTAMPTZ,
  prescriber_id BIGINT, pharmacist_verified_id BIGINT,
  started_at TIMESTAMPTZ, stopped_at TIMESTAMPTZ,
  side_effects JSONB, high_alert_flag BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE immunosuppression_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE immunosuppression_log FORCE ROW LEVEL SECURITY;
CREATE POLICY immunosuppression_log_tenant ON immunosuppression_log USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 8. rejection_episodes
CREATE TABLE rejection_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL, transplant_id BIGINT NOT NULL REFERENCES transplant_procedure(id),
  episode_date TIMESTAMPTZ NOT NULL,
  rejection_type VARCHAR(30), banff_grade VARCHAR(20),
  dsa_mfi_at_event JSONB, treatment_given JSONB,
  response VARCHAR(20), graft_outcome VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE rejection_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rejection_episodes FORCE ROW LEVEL SECURITY;
CREATE POLICY rejection_episodes_tenant ON rejection_episodes USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 9. protocol_biopsies
CREATE TABLE protocol_biopsies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  transplant_id BIGINT NOT NULL, patient_id BIGINT NOT NULL,
  biopsy_date TIMESTAMPTZ, biopsy_type VARCHAR(20),
  indication TEXT, cores_taken INT, glomeruli_count INT,
  light_microscopy_findings JSONB,
  immunofluorescence_findings JSONB,
  electron_microscopy_findings JSONB,
  sv40_immunostain VARCHAR(10), c4d_score VARCHAR(10),
  banff_category VARCHAR(20), pathologist_id BIGINT,
  report_url_phi_vault TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE protocol_biopsies ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_biopsies FORCE ROW LEVEL SECURITY;
CREATE POLICY protocol_biopsies_tenant ON protocol_biopsies USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 10. graft_surveillance
CREATE TABLE graft_surveillance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL, transplant_id BIGINT NOT NULL,
  visit_date TIMESTAMPTZ,
  scr NUMERIC(5,2), egfr NUMERIC(6,2),
  urea NUMERIC(5,1), proteinuria_g_24h NUMERIC(5,2),
  bk_virus_pcr_copies_ml NUMERIC(12,2),
  cmv_pcr_copies_ml NUMERIC(12,2),
  dsa_panel JSONB, tacrolimus_trough NUMERIC(6,2),
  bp_systolic INT, bp_diastolic INT, weight_kg NUMERIC(5,1),
  medication_adherence_pct NUMERIC(5,2),
  alert_flags JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE graft_surveillance ENABLE ROW LEVEL SECURITY;
ALTER TABLE graft_surveillance FORCE ROW LEVEL SECURITY;
CREATE POLICY graft_surveillance_tenant ON graft_surveillance USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 11. post_transplant_infections
CREATE TABLE post_transplant_infections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL, transplant_id BIGINT NOT NULL,
  infection_date TIMESTAMPTZ, pathogen VARCHAR(100),
  infection_site VARCHAR(50), severity VARCHAR(20),
  treatment JSONB, hospitalization_required BOOLEAN,
  prophylaxis_status VARCHAR(30),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE post_transplant_infections ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_transplant_infections FORCE ROW LEVEL SECURITY;
CREATE POLICY post_transplant_infections_tenant ON post_transplant_infections USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 12. long_term_followup
CREATE TABLE long_term_followup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL, transplant_id BIGINT NOT NULL,
  years_post_transplant NUMERIC(5,2),
  graft_function VARCHAR(20),
  comorbidities JSONB, medication_adherence NUMERIC(5,2),
  qol_score NUMERIC(5,2),
  rehospitalizations_ytd INT,
  last_biopsy_date DATE, last_dsa_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE long_term_followup ENABLE ROW LEVEL SECURITY;
ALTER TABLE long_term_followup FORCE ROW LEVEL SECURITY;
CREATE POLICY long_term_followup_tenant ON long_term_followup USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 13. paired_exchange_pool
CREATE TABLE paired_exchange_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  donor_id BIGINT NOT NULL, recipient_id BIGINT NOT NULL,
  pool_entry_date TIMESTAMPTZ,
  incompatibility_reason VARCHAR(50),
  match_run_id UUID,
  match_offered_at TIMESTAMPTZ,
  match_accepted_at TIMESTAMPTZ,
  match_completed_at TIMESTAMPTZ,
  match_status VARCHAR(30) DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE paired_exchange_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE paired_exchange_pool FORCE ROW LEVEL SECURITY;
CREATE POLICY paired_exchange_pool_tenant ON paired_exchange_pool USING (tenant_id = current_setting('app.tenant_id')::UUID);

COMMIT;