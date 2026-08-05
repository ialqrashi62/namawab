-- p3_CARD_105_up.sql — CARD-105 (Cardio-Obstetrics) forward migration (non-destructive)

BEGIN;
INSERT INTO schema_migrations (id, name, applied_at, notes)
VALUES ('p3_CARD_105_up','p3_CARD_105_up',now(),'Cardio-Obstetrics Tier-3 dept schema')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS card_105_visits (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT,
  provider_id UUID,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  chief_complaint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_card_105_v_p ON card_105_visits(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_card_105_v_c ON card_105_visits(tenant_id, created_at DESC);
ALTER TABLE card_105_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_105_visits FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS card_105_v_t ON card_105_visits;
CREATE POLICY card_105_v_t ON card_105_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS card_105_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES card_105_visits(id) ON DELETE SET NULL,
  orders JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_card_105_o_v ON card_105_orders(tenant_id, visit_id);
ALTER TABLE card_105_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_105_orders FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS card_105_o_t ON card_105_orders;
CREATE POLICY card_105_o_t ON card_105_orders
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS card_105_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES card_105_visits(id) ON DELETE SET NULL,
  test_name VARCHAR(64),
  value_text TEXT,
  resulted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_card_105_r_v ON card_105_results(tenant_id, visit_id);
ALTER TABLE card_105_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_105_results FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS card_105_r_t ON card_105_results;
CREATE POLICY card_105_r_t ON card_105_results
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

COMMIT;
