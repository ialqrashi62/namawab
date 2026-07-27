-- military_up.sql — schema for military PCC.
CREATE TABLE IF NOT EXISTS military_admissions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_military_tenant ON military_admissions(tenant_id);
CREATE TABLE IF NOT EXISTS military_assessments (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES military_admissions(id),
  score JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS military_orders (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES military_admissions(id),
  order_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS military_audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event TEXT NOT NULL,
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_military_audit_tenant ON military_audit_log(tenant_id);
-- Engine functions: CombatTourniquet, MildTraumaticBrainInjury, PTSDRiskAssessment, BlastInjuryType, TCCCAlgorithm, MilitaryTriageMASS, HypothermiaCombat, ChemicalWarfareExposure, AeroEvacPriority, FieldDentalEmergency
