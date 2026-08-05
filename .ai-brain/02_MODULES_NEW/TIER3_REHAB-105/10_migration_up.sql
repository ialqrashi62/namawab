-- p3_REHAB_105_up.sql — REHAB-105 (Pediatric Rehab) forward migration (non-destructive)

BEGIN;
INSERT INTO schema_migrations (id, name, applied_at, notes)
VALUES ('p3_REHAB_105_up','p3_REHAB_105_up',now(),'Pediatric Rehab Tier-3 dept schema')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS rehab_105_visits (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT,
  provider_id UUID,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  chief_complaint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rehab_105_v_p ON rehab_105_visits(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_rehab_105_v_c ON rehab_105_visits(tenant_id, created_at DESC);
ALTER TABLE rehab_105_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_105_visits FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehab_105_v_t ON rehab_105_visits;
CREATE POLICY rehab_105_v_t ON rehab_105_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS rehab_105_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES rehab_105_visits(id) ON DELETE SET NULL,
  orders JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rehab_105_o_v ON rehab_105_orders(tenant_id, visit_id);
ALTER TABLE rehab_105_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_105_orders FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehab_105_o_t ON rehab_105_orders;
CREATE POLICY rehab_105_o_t ON rehab_105_orders
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS rehab_105_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES rehab_105_visits(id) ON DELETE SET NULL,
  test_name VARCHAR(64),
  value_text TEXT,
  resulted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rehab_105_r_v ON rehab_105_results(tenant_id, visit_id);
ALTER TABLE rehab_105_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_105_results FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehab_105_r_t ON rehab_105_results;
CREATE POLICY rehab_105_r_t ON rehab_105_results
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

COMMIT;
