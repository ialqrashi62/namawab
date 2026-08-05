-- p3_ADM_110_up.sql — ADM-110 (Patient Experience) forward migration (non-destructive)

BEGIN;
INSERT INTO schema_migrations (id, name, applied_at, notes)
VALUES ('p3_ADM_110_up','p3_ADM_110_up',now(),'Patient Experience Tier-3 dept schema')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS adm_110_visits (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT,
  provider_id UUID,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  chief_complaint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_adm_110_v_p ON adm_110_visits(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_adm_110_v_c ON adm_110_visits(tenant_id, created_at DESC);
ALTER TABLE adm_110_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_110_visits FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_110_v_t ON adm_110_visits;
CREATE POLICY adm_110_v_t ON adm_110_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS adm_110_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES adm_110_visits(id) ON DELETE SET NULL,
  orders JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_adm_110_o_v ON adm_110_orders(tenant_id, visit_id);
ALTER TABLE adm_110_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_110_orders FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_110_o_t ON adm_110_orders;
CREATE POLICY adm_110_o_t ON adm_110_orders
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS adm_110_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES adm_110_visits(id) ON DELETE SET NULL,
  test_name VARCHAR(64),
  value_text TEXT,
  resulted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_adm_110_r_v ON adm_110_results(tenant_id, visit_id);
ALTER TABLE adm_110_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_110_results FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_110_r_t ON adm_110_results;
CREATE POLICY adm_110_r_t ON adm_110_results
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

COMMIT;
