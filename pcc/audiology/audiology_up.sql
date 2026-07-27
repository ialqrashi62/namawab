-- audiology_up.sql — schema for audiology PCC.
CREATE TABLE IF NOT EXISTS audiology_admissions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audiology_tenant ON audiology_admissions(tenant_id);
CREATE TABLE IF NOT EXISTS audiology_assessments (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES audiology_admissions(id),
  score JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS audiology_orders (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES audiology_admissions(id),
  order_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS audiology_audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event TEXT NOT NULL,
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audiology_audit_tenant ON audiology_audit_log(tenant_id);
-- Engine functions: PureToneAudiometry, AsymmetricHearingLoss, TinnitusSeverity, ABRThreshold, OtoacousticEmissions, WordRecognitionScore, CochlearImplantCandidate, Hyperacusis, VestibularAssessment, PresbycusisProgression
