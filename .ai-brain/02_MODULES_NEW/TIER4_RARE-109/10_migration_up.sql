-- p3_RARE_109_up.sql — RARE-109 (Pain Management (advanced)) forward migration (non-destructive)

BEGIN;
INSERT INTO schema_migrations (id, name, applied_at, notes)
VALUES ('p3_RARE_109_up','p3_RARE_109_up',now(),'Pain Management (advanced) Tier-3 dept schema')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS rare_109_visits (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT,
  provider_id UUID,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  chief_complaint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rare_109_v_p ON rare_109_visits(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_rare_109_v_c ON rare_109_visits(tenant_id, created_at DESC);
ALTER TABLE rare_109_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_109_visits FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_109_v_t ON rare_109_visits;
CREATE POLICY rare_109_v_t ON rare_109_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS rare_109_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES rare_109_visits(id) ON DELETE SET NULL,
  orders JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rare_109_o_v ON rare_109_orders(tenant_id, visit_id);
ALTER TABLE rare_109_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_109_orders FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_109_o_t ON rare_109_orders;
CREATE POLICY rare_109_o_t ON rare_109_orders
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS rare_109_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES rare_109_visits(id) ON DELETE SET NULL,
  test_name VARCHAR(64),
  value_text TEXT,
  resulted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rare_109_r_v ON rare_109_results(tenant_id, visit_id);
ALTER TABLE rare_109_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_109_results FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_109_r_t ON rare_109_results;
CREATE POLICY rare_109_r_t ON rare_109_results
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

COMMIT;
