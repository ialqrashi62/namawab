-- p3_ONC_104_up.sql — ONC-104 (Survivorship Clinic) forward migration (non-destructive)

BEGIN;
INSERT INTO schema_migrations (id, name, applied_at, notes)
VALUES ('p3_ONC_104_up','p3_ONC_104_up',now(),'Survivorship Clinic Tier-3 dept schema')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS onc_104_visits (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT,
  provider_id UUID,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  chief_complaint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_onc_104_v_p ON onc_104_visits(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_onc_104_v_c ON onc_104_visits(tenant_id, created_at DESC);
ALTER TABLE onc_104_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_104_visits FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS onc_104_v_t ON onc_104_visits;
CREATE POLICY onc_104_v_t ON onc_104_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS onc_104_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES onc_104_visits(id) ON DELETE SET NULL,
  orders JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_onc_104_o_v ON onc_104_orders(tenant_id, visit_id);
ALTER TABLE onc_104_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_104_orders FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS onc_104_o_t ON onc_104_orders;
CREATE POLICY onc_104_o_t ON onc_104_orders
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS onc_104_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES onc_104_visits(id) ON DELETE SET NULL,
  test_name VARCHAR(64),
  value_text TEXT,
  resulted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_onc_104_r_v ON onc_104_results(tenant_id, visit_id);
ALTER TABLE onc_104_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_104_results FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS onc_104_r_t ON onc_104_results;
CREATE POLICY onc_104_r_t ON onc_104_results
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

COMMIT;
