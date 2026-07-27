-- cardio_surg_up.sql — schema for cardio_surg PCC.
CREATE TABLE IF NOT EXISTS cardio_surg_admissions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cardio_surg_tenant ON cardio_surg_admissions(tenant_id);
CREATE TABLE IF NOT EXISTS cardio_surg_assessments (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES cardio_surg_admissions(id),
  score JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS cardio_surg_orders (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES cardio_surg_admissions(id),
  order_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS cardio_surg_audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event TEXT NOT NULL,
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cardio_surg_audit_tenant ON cardio_surg_audit_log(tenant_id);
-- Engine functions: CABGEuroSCOREII, AorticStenosisValveIndication, ECMOWeaningReadiness, VasoactiveInotropicScore, PredictedPostOpFEV1, AorticDissectionStanford, PostCABGAFStrokeRisk, MitralValveCarpentier, EsophagectomyRisk, MediastinitisElGamel
