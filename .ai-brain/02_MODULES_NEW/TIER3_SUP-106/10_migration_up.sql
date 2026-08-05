-- p3_SUP_106_up.sql — SUP-106 (Biomedical Engineering) forward migration (non-destructive)

BEGIN;
INSERT INTO schema_migrations (id, name, applied_at, notes)
VALUES ('p3_SUP_106_up','p3_SUP_106_up',now(),'Biomedical Engineering Tier-3 dept schema')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS sup_106_visits (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT,
  provider_id UUID,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  chief_complaint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sup_106_v_p ON sup_106_visits(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_sup_106_v_c ON sup_106_visits(tenant_id, created_at DESC);
ALTER TABLE sup_106_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE sup_106_visits FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sup_106_v_t ON sup_106_visits;
CREATE POLICY sup_106_v_t ON sup_106_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS sup_106_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES sup_106_visits(id) ON DELETE SET NULL,
  orders JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sup_106_o_v ON sup_106_orders(tenant_id, visit_id);
ALTER TABLE sup_106_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sup_106_orders FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sup_106_o_t ON sup_106_orders;
CREATE POLICY sup_106_o_t ON sup_106_orders
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS sup_106_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES sup_106_visits(id) ON DELETE SET NULL,
  test_name VARCHAR(64),
  value_text TEXT,
  resulted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sup_106_r_v ON sup_106_results(tenant_id, visit_id);
ALTER TABLE sup_106_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE sup_106_results FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sup_106_r_t ON sup_106_results;
CREATE POLICY sup_106_r_t ON sup_106_results
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

COMMIT;
