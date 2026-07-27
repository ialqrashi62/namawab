-- occupational_up.sql — schema for occupational PCC.
CREATE TABLE IF NOT EXISTS occupational_admissions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_occupational_tenant ON occupational_admissions(tenant_id);
CREATE TABLE IF NOT EXISTS occupational_assessments (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES occupational_admissions(id),
  score JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS occupational_orders (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES occupational_admissions(id),
  order_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS occupational_audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event TEXT NOT NULL,
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_occupational_audit_tenant ON occupational_audit_log(tenant_id);
-- Engine functions: FitnessForDuty, RespiratorClearanceOSHA, HearingConservationNIOSH, ReturnToWorkPlan, RULAERGO, ChemicalExposureLimit, ShiftWorkDisorder, BloodborneExposure, BurnoutMaslach, WMSDRisk
