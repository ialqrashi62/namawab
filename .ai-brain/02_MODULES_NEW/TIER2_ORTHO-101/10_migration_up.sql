-- p3_ORTHO_101_up.sql — ORTHO-101 (Spine Surgery) forward migration (non-destructive)

BEGIN;
INSERT INTO schema_migrations (id, name, applied_at, notes)
VALUES ('p3_ORTHO_101_up','p3_ORTHO_101_up',now(),'Spine Surgery Tier-3 dept schema')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS ortho_101_visits (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT,
  provider_id UUID,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  chief_complaint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ortho_101_v_p ON ortho_101_visits(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_ortho_101_v_c ON ortho_101_visits(tenant_id, created_at DESC);
ALTER TABLE ortho_101_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortho_101_visits FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ortho_101_v_t ON ortho_101_visits;
CREATE POLICY ortho_101_v_t ON ortho_101_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS ortho_101_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES ortho_101_visits(id) ON DELETE SET NULL,
  orders JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ortho_101_o_v ON ortho_101_orders(tenant_id, visit_id);
ALTER TABLE ortho_101_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortho_101_orders FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ortho_101_o_t ON ortho_101_orders;
CREATE POLICY ortho_101_o_t ON ortho_101_orders
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS ortho_101_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES ortho_101_visits(id) ON DELETE SET NULL,
  test_name VARCHAR(64),
  value_text TEXT,
  resulted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ortho_101_r_v ON ortho_101_results(tenant_id, visit_id);
ALTER TABLE ortho_101_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortho_101_results FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ortho_101_r_t ON ortho_101_results;
CREATE POLICY ortho_101_r_t ON ortho_101_results
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

COMMIT;
