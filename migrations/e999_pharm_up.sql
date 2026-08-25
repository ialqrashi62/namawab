-- filepath: migrations/e999_pharm_up.sql
-- TIER14_PHARM_EXT 101-106 pharmacy tables

CREATE TABLE IF NOT EXISTS tier14_pharm_order (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  order_id TEXT,
  medication_id TEXT,
  prescribed_status TEXT,
  dispensed_status TEXT,
  administered_status TEXT,
  discontinued_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier14_pharm_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier14_pharm_order FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier14_pharm_order_tenant ON tier14_pharm_order;
CREATE POLICY tier14_pharm_order_tenant ON tier14_pharm_order USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier14_pharm_order_tenant_idx ON tier14_pharm_order (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier14_pharm_compounding (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  compounding_id TEXT,
  recipe_id TEXT,
  compounding_type TEXT,
  recipe_status TEXT,
  iso_status TEXT,
  hazardous_class TEXT,
  hazardous_status TEXT,
  batch_status TEXT,
  released_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier14_pharm_compounding ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier14_pharm_compounding FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier14_pharm_compounding_tenant ON tier14_pharm_compounding;
CREATE POLICY tier14_pharm_compounding_tenant ON tier14_pharm_compounding USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier14_pharm_compounding_tenant_idx ON tier14_pharm_compounding (tenant_id, compounding_type, created_at DESC);

CREATE TABLE IF NOT EXISTS tier14_pharm_interaction (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  interaction_status TEXT,
  allergy_match TEXT,
  dose_band TEXT,
  renal_band TEXT,
  pgx_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier14_pharm_interaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier14_pharm_interaction FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier14_pharm_interaction_tenant ON tier14_pharm_interaction;
CREATE POLICY tier14_pharm_interaction_tenant ON tier14_pharm_interaction USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier14_pharm_interaction_tenant_idx ON tier14_pharm_interaction (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier14_pharm_formulary (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  medication_id TEXT,
  formulary_status TEXT,
  interchange_status TEXT,
  pa_status TEXT,
  therapeutic_class TEXT,
  shortage_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier14_pharm_formulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier14_pharm_formulary FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier14_pharm_formulary_tenant ON tier14_pharm_formulary;
CREATE POLICY tier14_pharm_formulary_tenant ON tier14_pharm_formulary USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier14_pharm_formulary_tenant_idx ON tier14_pharm_formulary (tenant_id, formulary_status, created_at DESC);

CREATE TABLE IF NOT EXISTS tier14_pharm_inventory (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  medication_id TEXT,
  lot_id TEXT,
  receive_status TEXT,
  par_status TEXT,
  expiration_status TEXT,
  recall_class TEXT,
  narcotic_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier14_pharm_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier14_pharm_inventory FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier14_pharm_inventory_tenant ON tier14_pharm_inventory;
CREATE POLICY tier14_pharm_inventory_tenant ON tier14_pharm_inventory USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier14_pharm_inventory_tenant_idx ON tier14_pharm_inventory (tenant_id, recall_class, created_at DESC);

CREATE TABLE IF NOT EXISTS tier14_pharm_stewardship (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  antibiotic_class TEXT,
  abx_status TEXT,
  iv_to_oral_status TEXT,
  opioid_mme DOUBLE PRECISION,
  opioid_status TEXT,
  stewardship_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier14_pharm_stewardship ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier14_pharm_stewardship FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier14_pharm_stewardship_tenant ON tier14_pharm_stewardship;
CREATE POLICY tier14_pharm_stewardship_tenant ON tier14_pharm_stewardship USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier14_pharm_stewardship_tenant_idx ON tier14_pharm_stewardship (tenant_id, antibiotic_class, created_at DESC);