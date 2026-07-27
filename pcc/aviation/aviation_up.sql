-- aviation_up.sql — schema for aviation PCC.
CREATE TABLE IF NOT EXISTS aviation_admissions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_aviation_tenant ON aviation_admissions(tenant_id);
CREATE TABLE IF NOT EXISTS aviation_assessments (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES aviation_admissions(id),
  score JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS aviation_orders (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES aviation_admissions(id),
  order_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS aviation_audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event TEXT NOT NULL,
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_aviation_audit_tenant ON aviation_audit_log(tenant_id);
-- Engine functions: AltitudeHypoxia, GLOCAssessment, RapidDecompression, PilotMedicalClass, CosmicRadiationDose, DVTLongFlightRisk, JetLagDisorder, BarotraumaAssessment, SpatialDisorientation, CabinAirQuality
