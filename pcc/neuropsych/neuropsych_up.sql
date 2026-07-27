-- neuropsych_up.sql — schema for neuropsych PCC.
CREATE TABLE IF NOT EXISTS neuropsych_admissions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_neuropsych_tenant ON neuropsych_admissions(tenant_id);
CREATE TABLE IF NOT EXISTS neuropsych_assessments (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES neuropsych_admissions(id),
  score JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS neuropsych_orders (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES neuropsych_admissions(id),
  order_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS neuropsych_audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event TEXT NOT NULL,
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_neuropsych_audit_tenant ON neuropsych_audit_log(tenant_id);
-- Engine functions: MoCAScore, MMSEFolstein, ACE3Addenbrokes, BeckDepressionInventory, HamiltonAnxietyScale, TrailMakingTestA, TrailMakingTestB, ConfusionAssessmentMethod, FABFrontal, WAISFSIQEstimate
