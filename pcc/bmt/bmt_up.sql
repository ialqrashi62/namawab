-- bmt_up.sql — schema for bmt PCC.
CREATE TABLE IF NOT EXISTS bmt_admissions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bmt_tenant ON bmt_admissions(tenant_id);
CREATE TABLE IF NOT EXISTS bmt_assessments (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES bmt_admissions(id),
  score JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bmt_orders (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES bmt_admissions(id),
  order_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bmt_audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event TEXT NOT NULL,
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bmt_audit_tenant ON bmt_audit_log(tenant_id);
-- Engine functions: HCTComorbidityIndex, AcuteGVHDGrade, EngraftmentAssessment, VenoOcclusiveDiseaseEBMT, ConditioningIntensity, PostTransplantCytopenias, HSCTRelapseRisk, VZVReactivationRisk, SOSProphylaxisIndication, DLIEligibility
