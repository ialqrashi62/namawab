-- filepath: migrations/e999-g146_periop_ext.sql
CREATE TABLE IF NOT EXISTS tier126_surgery_advanced_652 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  case_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier126_surgery_advanced_652 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier126_surgery_advanced_652 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t126_sa_652_isolation ON tier126_surgery_advanced_652;
CREATE POLICY t126_sa_652_isolation ON tier126_surgery_advanced_652 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier126_anesthesia_653 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  preop_id TEXT, induction_id TEXT, intraop_id TEXT, emergence_id TEXT, regional_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier126_anesthesia_653 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier126_anesthesia_653 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t126_an_653_isolation ON tier126_anesthesia_653;
CREATE POLICY t126_an_653_isolation ON tier126_anesthesia_653 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier126_pain_654 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  assess_id TEXT, analgesic_id TEXT, nerve_id TEXT, pca_id TEXT, intrathecal_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier126_pain_654 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier126_pain_654 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t126_pn_654_isolation ON tier126_pain_654;
CREATE POLICY t126_pn_654_isolation ON tier126_pain_654 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier126_orthotics_655 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  splint_id TEXT, cast_id TEXT, bracing_id TEXT, prosthetic_id TEXT, orthotic_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier126_orthotics_655 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier126_orthotics_655 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t126_or_655_isolation ON tier126_orthotics_655;
CREATE POLICY t126_or_655_isolation ON tier126_orthotics_655 USING (tenant_id = current_setting('app.tenant_id', true));