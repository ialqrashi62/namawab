-- tropical_up.sql — schema for tropical PCC.
CREATE TABLE IF NOT EXISTS tropical_admissions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tropical_tenant ON tropical_admissions(tenant_id);
CREATE TABLE IF NOT EXISTS tropical_assessments (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES tropical_admissions(id),
  score JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tropical_orders (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES tropical_admissions(id),
  order_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tropical_audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event TEXT NOT NULL,
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tropical_audit_tenant ON tropical_audit_log(tenant_id);
-- Engine functions: MalariaSeverityWHO, DengueSeverityWHO, ChikungunyaSeverity, LeishmaniasisType, SchistosomiasisComplication, TyphoidSeverity, RabiesPEP, TravelerDiarrhea, CutaneousLeishmaniasis, HemorrhagicFeverScreening
