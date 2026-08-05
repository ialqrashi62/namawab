-- p3_PEDS_110_up.sql — PEDS-110 (Pediatric Pulmonology) forward migration (non-destructive)

BEGIN;
INSERT INTO schema_migrations (id, name, applied_at, notes)
VALUES ('p3_PEDS_110_up','p3_PEDS_110_up',now(),'Pediatric Pulmonology Tier-3 dept schema')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS peds_110_visits (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT,
  provider_id UUID,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  chief_complaint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_peds_110_v_p ON peds_110_visits(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_peds_110_v_c ON peds_110_visits(tenant_id, created_at DESC);
ALTER TABLE peds_110_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE peds_110_visits FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS peds_110_v_t ON peds_110_visits;
CREATE POLICY peds_110_v_t ON peds_110_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS peds_110_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES peds_110_visits(id) ON DELETE SET NULL,
  orders JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_peds_110_o_v ON peds_110_orders(tenant_id, visit_id);
ALTER TABLE peds_110_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE peds_110_orders FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS peds_110_o_t ON peds_110_orders;
CREATE POLICY peds_110_o_t ON peds_110_orders
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS peds_110_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES peds_110_visits(id) ON DELETE SET NULL,
  test_name VARCHAR(64),
  value_text TEXT,
  resulted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_peds_110_r_v ON peds_110_results(tenant_id, visit_id);
ALTER TABLE peds_110_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE peds_110_results FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS peds_110_r_t ON peds_110_results;
CREATE POLICY peds_110_r_t ON peds_110_results
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

COMMIT;
