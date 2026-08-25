-- e281 TIER3_ONC-101 Chemotherapy Safety / Dosing UP
CREATE TABLE IF NOT EXISTS onc_chemo_orders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  regimen_name VARCHAR(80),
  cycle_number INTEGER,
  total_dose_mg NUMERIC(8,2),
  bsa_m2 NUMERIC(4,2),
  dose_adjustment_pct INTEGER,
  toxicity_grade_current INTEGER,
  ordered_by INTEGER,
  ordered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE onc_chemo_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_chemo_orders FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS onc_co_tenant_isolation ON onc_chemo_orders;
CREATE POLICY onc_co_tenant_isolation ON onc_chemo_orders
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS onc_toxicity_events (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  event_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  cycle_number INTEGER,
  ctcae_grade INTEGER,
  toxicity_type VARCHAR(60),
  dose_modified VARCHAR(5),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE onc_toxicity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_toxicity_events FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS onc_te_tenant_isolation ON onc_toxicity_events;
CREATE POLICY onc_te_tenant_isolation ON onc_toxicity_events
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));