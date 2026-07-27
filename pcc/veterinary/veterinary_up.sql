-- veterinary_up.sql — schema for veterinary PCC.
CREATE TABLE IF NOT EXISTS veterinary_admissions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_veterinary_tenant ON veterinary_admissions(tenant_id);
CREATE TABLE IF NOT EXISTS veterinary_assessments (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES veterinary_admissions(id),
  score JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS veterinary_orders (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES veterinary_admissions(id),
  order_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS veterinary_audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event TEXT NOT NULL,
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_veterinary_audit_tenant ON veterinary_audit_log(tenant_id);
-- Engine functions: RabiesPetExposurerisk, BrucellosisRisk, AnthraxExposure, LeptospirosisSeverity, QFeverChronic, HendraNipahRisk, CatScratchDisease, WestNileNeuroinvasive, ToxoplasmaPregnancy, MycobacteriumBovis
