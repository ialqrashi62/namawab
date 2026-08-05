-- p1_NEURO_001_up.sql — NEURO-001 (Neurology) forward migration (non-destructive)

BEGIN;

INSERT INTO schema_migrations (id, name, applied_at, notes)
VALUES ('p1_NEURO_001_up', 'p1_NEURO_001_up', now(), 'Neurology Tier-1 dept schema')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS neuro_001_visits (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  provider_id UUID,
  visit_type VARCHAR(32) NOT NULL,
  chief_complaint TEXT,
  hpi TEXT,
  exam TEXT,
  ai_assessment_id BIGINT,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_neuro_001_visits_tpat ON neuro_001_visits(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_neuro_001_visits_tcrt ON neuro_001_visits(tenant_id, created_at DESC);
ALTER TABLE neuro_001_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_001_visits FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_001_visits_tenant ON neuro_001_visits;
CREATE POLICY neuro_001_visits_tenant ON neuro_001_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS neuro_001_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES neuro_001_visits(id) ON DELETE SET NULL,
  orders JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_neuro_001_orders_visit ON neuro_001_orders(tenant_id, visit_id);
ALTER TABLE neuro_001_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_001_orders FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_001_orders_tenant ON neuro_001_orders;
CREATE POLICY neuro_001_orders_tenant ON neuro_001_orders
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS neuro_001_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES neuro_001_visits(id) ON DELETE SET NULL,
  test_type VARCHAR(64), test_code VARCHAR(64),
  value_num NUMERIC, value_text TEXT,
  abnormal_flag VARCHAR(8),
  resulted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_neuro_001_results_visit ON neuro_001_results(tenant_id, visit_id);
CREATE INDEX IF NOT EXISTS idx_neuro_001_results_dt ON neuro_001_results(tenant_id, resulted_at DESC);
ALTER TABLE neuro_001_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_001_results FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_001_results_tenant ON neuro_001_results;
CREATE POLICY neuro_001_results_tenant ON neuro_001_results
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS neuro_001_tasks_v2 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES neuro_001_visits(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  priority VARCHAR(16),
  status VARCHAR(16) NOT NULL DEFAULT 'open',
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_neuro_001_tasks_status ON neuro_001_tasks_v2(tenant_id, status);
ALTER TABLE neuro_001_tasks_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_001_tasks_v2 FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_001_tasks_tenant ON neuro_001_tasks_v2;
CREATE POLICY neuro_001_tasks_tenant ON neuro_001_tasks_v2
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS neuro_001_ai_assessments (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  prompt_id VARCHAR(64) NOT NULL,
  visit_id BIGINT REFERENCES neuro_001_visits(id) ON DELETE SET NULL,
  prompt_version VARCHAR(16) NOT NULL,
  model_used VARCHAR(64),
  output JSONB, citations JSONB,
  confidence NUMERIC(4,3),
  override_status VARCHAR(16) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_neuro_001_ai_visit ON neuro_001_ai_assessments(tenant_id, visit_id);
ALTER TABLE neuro_001_ai_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_001_ai_assessments FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_001_ai_tenant ON neuro_001_ai_assessments;
CREATE POLICY neuro_001_ai_tenant ON neuro_001_ai_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

COMMIT;
