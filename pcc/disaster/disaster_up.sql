-- disaster_up.sql — schema for disaster PCC.
CREATE TABLE IF NOT EXISTS disaster_admissions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_disaster_tenant ON disaster_admissions(tenant_id);
CREATE TABLE IF NOT EXISTS disaster_assessments (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES disaster_admissions(id),
  score JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS disaster_orders (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES disaster_admissions(id),
  order_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS disaster_audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event TEXT NOT NULL,
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_disaster_audit_tenant ON disaster_audit_log(tenant_id);
-- Engine functions: STARTTriage, IncidentCommandActivation, HazmatDeconNeed, MCIResourceAllocation, MedicalTriageSieve, ShelterCapacityPlan, WaterSanitationEmergency, EpidemicOutbreakDetection, MortalityRateCrisis, WoundTetanusRiskAssessment
