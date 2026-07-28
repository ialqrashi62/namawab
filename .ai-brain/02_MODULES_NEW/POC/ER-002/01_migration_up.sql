<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
-- ER-002 Migration UP — 14 tables
BEGIN;

-- 1. trauma_activations
CREATE TABLE trauma_activations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  activation_tier SMALLINT NOT NULL,
  activated_at TIMESTAMPTZ,
  activated_by BIGINT,
  mechanism TEXT,
  criteria_met JSONB,
  team_notified JSONB,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_activations FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_activations_tenant ON trauma_activations USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 2-14 similar (abbreviated for brevity; see CONTEXT_BRIEFS §3.4 for full DDL)

CREATE TABLE trauma_primary_survey (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  survey_type VARCHAR(20),
  airway VARCHAR(50), breathing VARCHAR(50), circulation VARCHAR(50),
  disability VARCHAR(50), exposure VARCHAR(50),
  gcs_eye SMALLINT, gcs_verbal SMALLINT, gcs_motor SMALLINT, gcs_total SMALLINT,
  recorded_at TIMESTAMPTZ, recorded_by BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_primary_survey ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_primary_survey FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_primary_survey_tenant ON trauma_primary_survey USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_secondary_survey (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  head_to_toe_findings TEXT,
  past_medical_history TEXT, allergies TEXT, medications TEXT, last_meal TIMESTAMPTZ,
  events_leading TEXT,
  recorded_at TIMESTAMPTZ, recorded_by BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_secondary_survey ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_secondary_survey FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_secondary_survey_tenant ON trauma_secondary_survey USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_injuries_ais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  body_region VARCHAR(30), ais_severity SMALLINT, ais_descriptor VARCHAR(20),
  injury_description_encrypted BYTEA,
  laterality VARCHAR(10), penetrating BOOLEAN,
  coding_by BIGINT, coding_reviewed_by BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_injuries_ais ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_injuries_ais FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_injuries_ais_tenant ON trauma_injuries_ais USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_iss_score (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  iss_total SMALLINT, max_ais SMALLINT, three_highest_ais JSONB,
  mortality_band VARCHAR(20),
  calculated_at TIMESTAMPTZ, calculated_by BIGINT, formula_version VARCHAR(10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_iss_score ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_iss_score FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_iss_score_tenant ON trauma_iss_score USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_mtp_activations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  activated_at TIMESTAMPTZ, activated_by BIGINT,
  trigger_reason TEXT, abc_score SMALLINT,
  lab_values JSONB, units_ordered JSONB, units_transfused JSONB,
  ratio_1to1to1_compliance BOOLEAN,
  terminated_at TIMESTAMPTZ, terminated_by BIGINT, termination_reason TEXT,
  total_prbc INT, total_ffp INT, total_platelets INT, total_cryo INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_mtp_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_mtp_activations FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_mtp_activations_tenant ON trauma_mtp_activations USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_operative_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  procedure_time TIMESTAMPTZ, procedure_name VARCHAR(200),
  surgeon_id BIGINT, anesthesia_id BIGINT,
  asa_class SMALLINT, approach VARCHAR(50),
  estimated_blood_loss INT, complications TEXT,
  operative_time_min INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_operative_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_operative_log FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_operative_log_tenant ON trauma_operative_log USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_transfers_in (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  sending_facility VARCHAR(200), sending_provider VARCHAR(200),
  transfer_mode VARCHAR(20), transfer_time TIMESTAMPTZ,
  referring_diagnosis_encrypted BYTEA, records_received BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_transfers_in ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_transfers_in FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_transfers_in_tenant ON trauma_transfers_in USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_transfers_out (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  receiving_facility VARCHAR(200), receiving_provider VARCHAR(200),
  transfer_mode VARCHAR(20),
  decision_time TIMESTAMPTZ, departure_time TIMESTAMPTZ,
  capability_gap VARCHAR(200),
  clinical_summary_encrypted BYTEA, image_count_sent INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_transfers_out ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_transfers_out FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_transfers_out_tenant ON trauma_transfers_out USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_registry_export (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  export_batch_id UUID,
  ntdb_compliant BOOLEAN,
  exported_at TIMESTAMPTZ, exported_by BIGINT,
  record_count INT, sha256_hash VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_registry_export ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_registry_export FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_registry_export_tenant ON trauma_registry_export USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_pi_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  encounter_id BIGINT,
  opened_at TIMESTAMPTZ, opened_by BIGINT,
  deviation_type VARCHAR(100), contributing_factors JSONB, action_items JSONB,
  loop_closed_at TIMESTAMPTZ, loop_closed_by BIGINT,
  fmea_link VARCHAR(200), sentinel_event BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_pi_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_pi_cases FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_pi_cases_tenant ON trauma_pi_cases USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_outreach_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  event_date TIMESTAMPTZ, event_type VARCHAR(50),
  audience VARCHAR(200), participants_count INT, materials_distributed INT,
  cost_sar NUMERIC(10,2), organizer VARCHAR(200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_outreach_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_outreach_events FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_outreach_events_tenant ON trauma_outreach_events USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  project_title VARCHAR(200), pi_name VARCHAR(200),
  irb_number VARCHAR(50), status VARCHAR(30),
  enrollment_target INT, current_enrollment INT,
  publications INT, start_date DATE, end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_research_projects FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_research_projects_tenant ON trauma_research_projects USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE TABLE trauma_prevention_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  program_name VARCHAR(200), target_population VARCHAR(200), delivery_mode VARCHAR(50),
  reach_count INT, period_start DATE, period_end DATE, kpis JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE trauma_prevention_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_prevention_programs FORCE ROW LEVEL SECURITY;
CREATE POLICY trauma_prevention_programs_tenant ON trauma_prevention_programs USING (tenant_id = current_setting('app.tenant_id')::UUID);

COMMIT;