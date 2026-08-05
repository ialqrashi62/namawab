-- p1_003 — GI-001 (Gastroenterology) — forward migration (non-destructive)

BEGIN;

INSERT INTO schema_migrations (id, name, applied_at, notes)
VALUES ('p1_003', 'p1_003_gi_001', now(), 'Gastroenterology Tier-1 dept schema')
ON CONFLICT (id) DO NOTHING;

-- gi_visits
CREATE TABLE IF NOT EXISTS gi_visits (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  provider_id UUID,
  visit_type VARCHAR(32) NOT NULL,
  chief_complaint TEXT,
  hpi TEXT,
  exam TEXT,
  ai_assessment_id BIGINT,
  red_flag_fired BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gi_visits_tenant_patient ON gi_visits(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_gi_visits_tenant_created ON gi_visits(tenant_id, created_at DESC);
ALTER TABLE gi_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_visits FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS gi_visits_tenant ON gi_visits;
CREATE POLICY gi_visits_tenant ON gi_visits
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- gi_procedures
CREATE TABLE IF NOT EXISTS gi_procedures (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES gi_visits(id) ON DELETE SET NULL,
  procedure_type VARCHAR(64) NOT NULL,
  scheduled_at TIMESTAMPTZ,
  performed_at TIMESTAMPTZ,
  endoscopist_id UUID,
  findings TEXT,
  intervention_performed TEXT,
  asa_score INT,
  complications TEXT,
  duration_min INT,
  cpt_code VARCHAR(16),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_gi_proc_visit ON gi_procedures(tenant_id, visit_id);
CREATE INDEX IF NOT EXISTS idx_gi_proc_type ON gi_procedures(tenant_id, procedure_type, performed_at DESC);
ALTER TABLE gi_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_procedures FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS gi_proc_tenant ON gi_procedures;
CREATE POLICY gi_proc_tenant ON gi_procedures
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- gi_biopsy_results
CREATE TABLE IF NOT EXISTS gi_biopsy_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  procedure_id BIGINT REFERENCES gi_procedures(id) ON DELETE SET NULL,
  specimen_site VARCHAR(64),
  histopathology TEXT,
  dysplasia VARCHAR(32),
  helico_pylori VARCHAR(16),
  margins VARCHAR(32),
  signed_at TIMESTAMPTZ,
  signed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_gi_biopsy_proc ON gi_biopsy_results(tenant_id, procedure_id);
ALTER TABLE gi_biopsy_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_biopsy_results FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS gi_biopsy_tenant ON gi_biopsy_results;
CREATE POLICY gi_biopsy_tenant ON gi_biopsy_results
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- gi_pathology_results
CREATE TABLE IF NOT EXISTS gi_pathology_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  procedure_id BIGINT REFERENCES gi_procedures(id) ON DELETE SET NULL,
  report TEXT,
  dx_ar TEXT,
  stage VARCHAR(32),
  molecular JSONB,
  signed_at TIMESTAMPTZ,
  signed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_gi_path_patient ON gi_pathology_results(tenant_id, patient_id);
ALTER TABLE gi_pathology_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_pathology_results FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS gi_path_tenant ON gi_pathology_results;
CREATE POLICY gi_path_tenant ON gi_pathology_results
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- gi_labs
CREATE TABLE IF NOT EXISTS gi_labs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  visit_id BIGINT REFERENCES gi_visits(id) ON DELETE SET NULL,
  test_name VARCHAR(64),
  test_code VARCHAR(64),
  value_num NUMERIC,
  value_text TEXT,
  unit VARCHAR(32),
  abnormal_flag VARCHAR(8),
  resulted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_gi_labs_patient ON gi_labs(tenant_id, patient_id, test_name, resulted_at DESC);
ALTER TABLE gi_labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_labs FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS gi_labs_tenant ON gi_labs;
CREATE POLICY gi_labs_tenant ON gi_labs
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- ibd_assessments
CREATE TABLE IF NOT EXISTS ibd_assessments (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  visit_id BIGINT REFERENCES gi_visits(id) ON DELETE SET NULL,
  ibd_type VARCHAR(8),
  montreal_age VARCHAR(8),
  montreal_location VARCHAR(8),
  montreal_behavior VARCHAR(8),
  mayo_score INT,
  sccai INT,
  c_dai INT,
  hbi INT,
  calprotectin NUMERIC,
  crp NUMERIC,
  endoscopy_severity VARCHAR(32),
  assessment_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ibd_assess_patient ON ibd_assessments(tenant_id, patient_id, assessment_date DESC);
ALTER TABLE ibd_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibd_assessments FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ibd_assess_tenant ON ibd_assessments;
CREATE POLICY ibd_assess_tenant ON ibd_assessments
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- gi_orders
CREATE TABLE IF NOT EXISTS gi_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES gi_visits(id) ON DELETE SET NULL,
  orders JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_gi_orders_visit ON gi_orders(tenant_id, visit_id);
ALTER TABLE gi_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_orders FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS gi_orders_tenant ON gi_orders;
CREATE POLICY gi_orders_tenant ON gi_orders
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- gi_tasks_v2
CREATE TABLE IF NOT EXISTS gi_tasks_v2 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES gi_visits(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  priority VARCHAR(16),
  status VARCHAR(16) NOT NULL DEFAULT 'open',
  due_at TIMESTAMPTZ,
  assigned_role VARCHAR(32),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_gi_tasks_status ON gi_tasks_v2(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_gi_tasks_due    ON gi_tasks_v2(tenant_id, due_at) WHERE status = 'open';
ALTER TABLE gi_tasks_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_tasks_v2 FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS gi_tasks_tenant ON gi_tasks_v2;
CREATE POLICY gi_tasks_tenant ON gi_tasks_v2
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

-- gi_ai_assessments
CREATE TABLE IF NOT EXISTS gi_ai_assessments (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  prompt_id VARCHAR(64) NOT NULL,
  visit_id BIGINT REFERENCES gi_visits(id) ON DELETE SET NULL,
  prompt_version VARCHAR(16) NOT NULL,
  model_used VARCHAR(64),
  output JSONB,
  citations JSONB,
  confidence NUMERIC(4,3),
  override_status VARCHAR(16) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_gi_ai_visit ON gi_ai_assessments(tenant_id, visit_id);
ALTER TABLE gi_ai_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_ai_assessments FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS gi_ai_tenant ON gi_ai_assessments;
CREATE POLICY gi_ai_tenant ON gi_ai_assessments
  USING       (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK  (tenant_id::text = current_setting('app.tenant_id', true)::text);

COMMIT;

DO $$
DECLARE v_count int;
BEGIN
  SELECT COUNT(*) INTO v_count FROM pg_tables
   WHERE schemaname = 'public' AND tablename LIKE 'gi_%'
      OR (schemaname='public' AND tablename='ibd_assessments');
  RAISE NOTICE 'p1_003 GI-001 migration applied (% dept-scoped tables)', v_count;
END $$;
