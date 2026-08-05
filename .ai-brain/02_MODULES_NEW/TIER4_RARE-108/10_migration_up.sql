-- p3_RARE_108_up.sql — RARE-108 (Disaster Medicine) forward migration (non-destructive)

BEGIN;
INSERT INTO schema_migrations (id, name, applied_at, notes)
VALUES ('p3_RARE_108_up','p3_RARE_108_up',now(),'Disaster Medicine Tier-3 dept schema')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS rare_108_visits (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT,
  provider_id UUID,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  chief_complaint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rare_108_v_p ON rare_108_visits(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_rare_108_v_c ON rare_108_visits(tenant_id, created_at DESC);
ALTER TABLE rare_108_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_108_visits FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_108_v_t ON rare_108_visits;
CREATE POLICY rare_108_v_t ON rare_108_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS rare_108_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES rare_108_visits(id) ON DELETE SET NULL,
  orders JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rare_108_o_v ON rare_108_orders(tenant_id, visit_id);
ALTER TABLE rare_108_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_108_orders FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_108_o_t ON rare_108_orders;
CREATE POLICY rare_108_o_t ON rare_108_orders
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS rare_108_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES rare_108_visits(id) ON DELETE SET NULL,
  test_name VARCHAR(64),
  value_text TEXT,
  resulted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rare_108_r_v ON rare_108_results(tenant_id, visit_id);
ALTER TABLE rare_108_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_108_results FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_108_r_t ON rare_108_results;
CREATE POLICY rare_108_r_t ON rare_108_results
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

COMMIT;
