-- p3_INT_102_up.sql — INT-102 (Aromatherapy) forward migration (non-destructive)

BEGIN;
INSERT INTO schema_migrations (id, name, applied_at, notes)
VALUES ('p3_INT_102_up','p3_INT_102_up',now(),'Aromatherapy Tier-3 dept schema')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS int_102_visits (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT,
  provider_id UUID,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  chief_complaint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_int_102_v_p ON int_102_visits(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_int_102_v_c ON int_102_visits(tenant_id, created_at DESC);
ALTER TABLE int_102_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE int_102_visits FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS int_102_v_t ON int_102_visits;
CREATE POLICY int_102_v_t ON int_102_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS int_102_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES int_102_visits(id) ON DELETE SET NULL,
  orders JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_int_102_o_v ON int_102_orders(tenant_id, visit_id);
ALTER TABLE int_102_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE int_102_orders FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS int_102_o_t ON int_102_orders;
CREATE POLICY int_102_o_t ON int_102_orders
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS int_102_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES int_102_visits(id) ON DELETE SET NULL,
  test_name VARCHAR(64),
  value_text TEXT,
  resulted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_int_102_r_v ON int_102_results(tenant_id, visit_id);
ALTER TABLE int_102_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE int_102_results FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS int_102_r_t ON int_102_results;
CREATE POLICY int_102_r_t ON int_102_results
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

COMMIT;
