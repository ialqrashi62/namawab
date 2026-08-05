-- 22_migration_up.sql
-- Tier-1: PULM-001 (Pulmonology) schema
-- Forward migration.  Non-destructive.  All tables have tenant_id + RLS.

-- ============================================
-- 0) Migration metadata
-- ============================================
INSERT INTO schema_migrations (id, name, applied_at, notes)
VALUES ('p1_002', 'p1_002_pulm_001', now(), 'Pulmonology Tier-1 dept schema')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 1) Patients (assumed already; safe expansion only)
-- ============================================
-- Already exists per namaweb baseline.  Skip recreation.

-- ============================================
-- 2) Pulmonary visits
-- ============================================
CREATE TABLE IF NOT EXISTS pulmonary_visits (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  provider_id UUID,
  visit_type VARCHAR(32) NOT NULL,            -- initial, follow_up, urgent, telehealth, sleep_study
  chief_complaint TEXT,
  hpi TEXT,
  ros TEXT,
  exam TEXT,
  assessment TEXT,
  plan TEXT,
  ai_assessment_id BIGINT,
  red_flag_fired BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(32) NOT NULL DEFAULT 'open', -- open, in_progress, completed, signed
  locked_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  signed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pulm_visits_tenant ON pulmonary_visits(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pulm_visits_tenant_patient ON pulmonary_visits(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_pulm_visits_tenant_created ON pulmonary_visits(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pulm_visits_open ON pulmonary_visits(tenant_id) WHERE status IN ('open','in_progress');

ALTER TABLE pulmonary_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulmonary_visits FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pulm_visits_tenant ON pulmonary_visits;
CREATE POLICY pulm_visits_tenant ON pulmonary_visits
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- ============================================
-- 3) Pulmonary orders
-- ============================================
CREATE TABLE IF NOT EXISTS pulmonary_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT NOT NULL REFERENCES pulmonary_visits(id) ON DELETE CASCADE,
  order_set_id VARCHAR(64),                   -- e.g., OS:PULM:COPD_EXACERBATION
  orders JSONB NOT NULL,
  placed_by UUID,
  placed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  discontinued_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pulm_orders_visit ON pulmonary_orders(tenant_id, visit_id);
CREATE INDEX IF NOT EXISTS idx_pulm_orders_active ON pulmonary_orders(tenant_id) WHERE status = 'active';

ALTER TABLE pulmonary_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulmonary_orders FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pulm_orders_tenant ON pulmonary_orders;
CREATE POLICY pulm_orders_tenant ON pulmonary_orders
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- ============================================
-- 4) Pulmonary results
-- ============================================
CREATE TABLE IF NOT EXISTS pulmonary_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES pulmonary_visits(id) ON DELETE SET NULL,
  patient_id BIGINT NOT NULL,
  test_type VARCHAR(64) NOT NULL,              -- PFT, ABG, imaging, lab, oxygen
  test_code VARCHAR(64),
  test_name VARCHAR(255),
  value_num NUMERIC,
  value_unit VARCHAR(32),
  value_text TEXT,
  abnormal_flag VARCHAR(8),                    -- L, H, HH, LL, A
  reference_range TEXT,
  resulted_at TIMESTAMPTZ NOT NULL,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  critical_value BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pulm_results_visit ON pulmonary_results(tenant_id, visit_id);
CREATE INDEX IF NOT EXISTS idx_pulm_results_patient ON pulmonary_results(tenant_id, patient_id, resulted_at DESC);
CREATE INDEX IF NOT EXISTS idx_pulm_results_critical ON pulmonary_results(tenant_id) WHERE critical_value = true;

ALTER TABLE pulmonary_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulmonary_results FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pulm_results_tenant ON pulmonary_results;
CREATE POLICY pulm_results_tenant ON pulmonary_results
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- ============================================
-- 5) Care pathways + steps
-- ============================================
CREATE TABLE IF NOT EXISTS pulmonary_care_pathways (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  pathway_id VARCHAR(64) NOT NULL,             -- PATH:PE_MASSIVE, etc.
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  current_step VARCHAR(64),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pulm_pathways_patient ON pulmonary_care_pathways(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_pulm_pathways_active ON pulmonary_care_pathways(tenant_id, pathway_id) WHERE status = 'active';

ALTER TABLE pulmonary_care_pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulmonary_care_pathways FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pulm_pathways_tenant ON pulmonary_care_pathways;
CREATE POLICY pulm_pathways_tenant ON pulmonary_care_pathways
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS pulmonary_pathway_steps (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  pathway_run_id BIGINT NOT NULL REFERENCES pulmonary_care_pathways(id) ON DELETE CASCADE,
  step_id VARCHAR(64) NOT NULL,
  entered_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  outcome VARCHAR(32),                          -- success, skipped, failed, escalated
  provider_id UUID,
  notes TEXT,
  audit_log_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pulm_pathway_steps_run ON pulmonary_pathway_steps(pathway_run_id, step_id);

ALTER TABLE pulmonary_pathway_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulmonary_pathway_steps FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pulm_pathway_steps_tenant ON pulmonary_pathway_steps;
CREATE POLICY pulm_pathway_steps_tenant ON pulmonary_pathway_steps
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- ============================================
-- 6) Sleep studies
-- ============================================
CREATE TABLE IF NOT EXISTS sleep_studies (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  visit_id BIGINT REFERENCES pulmonary_visits(id) ON DELETE SET NULL,
  study_type VARCHAR(32),                       -- diagnostic, titration, split-night, MWT
  study_date DATE,
  ahi NUMERIC,
  odi NUMERIC,
  tsh_50p NUMERIC,
  min_spo2 NUMERIC,
  study_pdf_path TEXT,
  interpretation TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sleep_studies_patient ON sleep_studies(tenant_id, patient_id, study_date DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_studies_unreviewed ON sleep_studies(tenant_id) WHERE reviewed_at IS NULL;

ALTER TABLE sleep_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_studies FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sleep_studies_tenant ON sleep_studies;
CREATE POLICY sleep_studies_tenant ON sleep_studies
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- ============================================
-- 7) Pulmonary function tests (PFTs)
-- ============================================
CREATE TABLE IF NOT EXISTS pulmonary_function_tests (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  visit_id BIGINT REFERENCES pulmonary_visits(id) ON DELETE SET NULL,
  test_date DATE NOT NULL,
  fev1 NUMERIC,
  fvc NUMERIC,
  fev1_fvc_ratio NUMERIC,
  dlco NUMERIC,
  bronchodilator_response BOOLEAN,
  test_quality VARCHAR(32),                     -- acceptable, sub-optimal, unacceptable
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pfts_patient ON pulmonary_function_tests(tenant_id, patient_id, test_date DESC);

ALTER TABLE pulmonary_function_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulmonary_function_tests FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pfts_tenant ON pulmonary_function_tests;
CREATE POLICY pfts_tenant ON pulmonary_function_tests
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- ============================================
-- 8) Lung biopsy reports
-- ============================================
CREATE TABLE IF NOT EXISTS lung_biopsy_reports (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  procedure_id BIGINT,
  specimen TEXT,
  histology_findings TEXT,
  diagnosis_ar TEXT,
  diagnosis_en TEXT,
  stage VARCHAR(32),                            -- T1N0M0, etc.
  molecular JSONB,                              -- {EGFR: 'mutant', ALK: 'negative', PDL1: '50%'}
  signed_at TIMESTAMPTZ,
  signed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lung_biopsy_patient ON lung_biopsy_reports(tenant_id, patient_id);

ALTER TABLE lung_biopsy_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE lung_biopsy_reports FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS lung_biopsy_tenant ON lung_biopsy_reports;
CREATE POLICY lung_biopsy_tenant ON lung_biopsy_reports
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- ============================================
-- 9) AI assessments
-- ============================================
CREATE TABLE IF NOT EXISTS ai_assessments (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  prompt_id VARCHAR(64) NOT NULL,               -- PROMPT:PULM-001:initial_assessment
  visit_id BIGINT REFERENCES pulmonary_visits(id) ON DELETE SET NULL,
  prompt_version VARCHAR(16) NOT NULL,
  model_target VARCHAR(64),
  model_used VARCHAR(64),
  input_redacted JSONB,
  output JSONB,
  citations JSONB,
  red_flags JSONB,
  drug_alerts JSONB,
  confidence_score NUMERIC(4,3),
  override_status VARCHAR(16),                   -- pending, accepted, edited, rejected
  override_reason TEXT,
  override_by UUID,
  provider_audit_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_assess_visit ON ai_assessments(tenant_id, visit_id);
CREATE INDEX IF NOT EXISTS idx_ai_assess_pending ON ai_assessments(tenant_id) WHERE override_status = 'pending';

ALTER TABLE ai_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_assessments FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_assess_tenant ON ai_assessments;
CREATE POLICY ai_assess_tenant ON ai_assessments
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- ============================================
-- 10) Tasks v2 (dept-scoped)
-- ============================================
CREATE TABLE IF NOT EXISTS pulmonary_tasks_v2 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT,
  visit_id BIGINT REFERENCES pulmonary_visits(id) ON DELETE CASCADE,
  pathway_run_id BIGINT REFERENCES pulmonary_care_pathways(id) ON DELETE SET NULL,
  step_id VARCHAR(64),
  task_type VARCHAR(32),                         -- order, medication, procedure, consult, review, document
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(16),                          -- stat, urgent, routine
  assigned_to UUID,
  assigned_role VARCHAR(32),
  due_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  completion_reason TEXT,
  escalated BOOLEAN NOT NULL DEFAULT false,
  audit_hash VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pulm_tasks_open ON pulmonary_tasks_v2(tenant_id, status);
-- Need a `status` column; add it
ALTER TABLE pulmonary_tasks_v2 ADD COLUMN IF NOT EXISTS status VARCHAR(16) NOT NULL DEFAULT 'open';
CREATE INDEX IF NOT EXISTS idx_pulm_tasks_status ON pulmonary_tasks_v2(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_pulm_tasks_due ON pulmonary_tasks_v2(tenant_id, due_at) WHERE status = 'open';

ALTER TABLE pulmonary_tasks_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulmonary_tasks_v2 FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pulm_tasks_tenant ON pulmonary_tasks_v2;
CREATE POLICY pulm_tasks_tenant ON pulmonary_tasks_v2
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- ============================================
-- 11) Force-RLS counters
-- ============================================
-- Track FORCE RLS for safety rail 5 audit.
UPDATE db_objects
   SET force_rls = true, rls_enabled = true, updated_at = now()
 WHERE object_type = 'table'
   AND schema_name = 'public'
   AND table_name IN (
     'pulmonary_visits',
     'pulmonary_orders',
     'pulmonary_results',
     'pulmonary_care_pathways',
     'pulmonary_pathway_steps',
     'sleep_studies',
     'pulmonary_function_tests',
     'lung_biopsy_reports',
     'ai_assessments',
     'pulmonary_tasks_v2'
   );

-- ============================================
-- 12) Audit / verify
-- ============================================
DO $$
DECLARE v_count int;
BEGIN
  SELECT COUNT(*) INTO v_count
    FROM pg_tables
   WHERE schemaname = 'public'
     AND tablename IN (
       'pulmonary_visits','pulmonary_orders','pulmonary_results',
       'pulmonary_care_pathways','pulmonary_pathway_steps',
       'sleep_studies','pulmonary_function_tests','lung_biopsy_reports',
       'ai_assessments','pulmonary_tasks_v2'
     );
  RAISE NOTICE 'p1_002 PULM-001 migration applied: % tables created', v_count;
END $$;
