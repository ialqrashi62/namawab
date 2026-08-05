-- p3_PULM_103_up.sql — PULM-103 (Respiratory Care) forward migration (non-destructive)

BEGIN;
INSERT INTO schema_migrations (id, name, applied_at, notes)
VALUES ('p3_PULM_103_up','p3_PULM_103_up',now(),'Respiratory Care Tier-3 dept schema')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS pulm_103_visits (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT,
  provider_id UUID,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  chief_complaint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pulm_103_v_p ON pulm_103_visits(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_pulm_103_v_c ON pulm_103_visits(tenant_id, created_at DESC);
ALTER TABLE pulm_103_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_103_visits FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pulm_103_v_t ON pulm_103_visits;
CREATE POLICY pulm_103_v_t ON pulm_103_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS pulm_103_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES pulm_103_visits(id) ON DELETE SET NULL,
  orders JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pulm_103_o_v ON pulm_103_orders(tenant_id, visit_id);
ALTER TABLE pulm_103_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_103_orders FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pulm_103_o_t ON pulm_103_orders;
CREATE POLICY pulm_103_o_t ON pulm_103_orders
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS pulm_103_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES pulm_103_visits(id) ON DELETE SET NULL,
  test_name VARCHAR(64),
  value_text TEXT,
  resulted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pulm_103_r_v ON pulm_103_results(tenant_id, visit_id);
ALTER TABLE pulm_103_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_103_results FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pulm_103_r_t ON pulm_103_results;
CREATE POLICY pulm_103_r_t ON pulm_103_results
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

COMMIT;
