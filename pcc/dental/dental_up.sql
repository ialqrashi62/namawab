-- dental_up.sql — schema for dental PCC.
CREATE TABLE IF NOT EXISTS dental_admissions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dental_tenant ON dental_admissions(tenant_id);
CREATE TABLE IF NOT EXISTS dental_assessments (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES dental_admissions(id),
  score JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS dental_orders (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES dental_admissions(id),
  order_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS dental_audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event TEXT NOT NULL,
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dental_audit_tenant ON dental_audit_log(tenant_id);
-- Engine functions: DMFTIndex, PeriodontalCPITN, OrthodonticIOTN, ToothVitality, CariesRiskCAMBRA, DentalTraumaIADT, OralCancerScreening, WisdomToothImpaction, OralHygieneIndexSimplified, AngleMalocclusion
