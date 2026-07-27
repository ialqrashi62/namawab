-- forensic_med_up.sql — schema for forensic_med PCC.
CREATE TABLE IF NOT EXISTS forensic_med_admissions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_forensic_med_tenant ON forensic_med_admissions(tenant_id);
CREATE TABLE IF NOT EXISTS forensic_med_assessments (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES forensic_med_admissions(id),
  score JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS forensic_med_orders (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES forensic_med_admissions(id),
  order_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS forensic_med_audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event TEXT NOT NULL,
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_forensic_med_audit_tenant ON forensic_med_audit_log(tenant_id);
-- Engine functions: MannerOfDeath, TimeSinceDeath, MechanismOfDeath, GunshotWoundRange, StrangulationClassification, DrowningDiagnosis, DrugRelatedDeath, SkeletalAgeEstimation, SexualAssaultInjury, BluntForceTrauma
