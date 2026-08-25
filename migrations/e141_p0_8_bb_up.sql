-- e141 P0-8 Blood Bank UP
-- Tables: bb_units, bb_crossmatch, bb_transfusions, bb_reactions

CREATE TABLE IF NOT EXISTS bb_units (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  unit_id VARCHAR(50) UNIQUE NOT NULL,
  abo VARCHAR(5) NOT NULL,
  rh VARCHAR(10) NOT NULL,
  donor_id VARCHAR(50),
  collection_date DATE,
  expiration_date DATE,
  isbt_barcode VARCHAR(80),
  irradiated BOOLEAN DEFAULT false,
  irradiation_date DATE,
  dose_cgy INTEGER,
  component_type VARCHAR(20) DEFAULT 'RBC',
  status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bb_units_tenant ON bb_units(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bb_units_abo ON bb_units(abo, rh);
ALTER TABLE bb_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_units FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bb_units_tenant_isolation ON bb_units;
CREATE POLICY bb_units_tenant_isolation ON bb_units
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS bb_crossmatch (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  crossmatch_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  unit_id VARCHAR(50) NOT NULL,
  abo_compatible BOOLEAN,
  rh_compatible BOOLEAN,
  antibody_screen TEXT[],
  status VARCHAR(20),
  result_by INTEGER,
  crossmatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE bb_crossmatch ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_crossmatch FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bb_cm_tenant_isolation ON bb_crossmatch;
CREATE POLICY bb_cm_tenant_isolation ON bb_crossmatch
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS bb_transfusions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  transfusion_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  unit_id VARCHAR(50) NOT NULL,
  component_type VARCHAR(20),
  dose_ml INTEGER,
  pre_vitals JSONB,
  post_vitals JSONB,
  administered_by INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'in_progress'
);
ALTER TABLE bb_transfusions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_transfusions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bb_tx_tenant_isolation ON bb_transfusions;
CREATE POLICY bb_tx_tenant_isolation ON bb_transfusions
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS bb_reactions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  reaction_id VARCHAR(50) UNIQUE NOT NULL,
  transfusion_id VARCHAR(50) NOT NULL,
  reaction_type VARCHAR(50),
  severity VARCHAR(30),
  symptoms TEXT[],
  workup_done BOOLEAN,
  reported_by INTEGER,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE bb_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_reactions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bb_rxn_tenant_isolation ON bb_reactions;
CREATE POLICY bb_rxn_tenant_isolation ON bb_reactions
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));