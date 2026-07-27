-- derm_ext_up.sql — schema for derm_ext PCC (deterministic engines, no I/O).
CREATE TABLE IF NOT EXISTS derm_ext_admissions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_derm_ext_tenant ON derm_ext_admissions(tenant_id);
CREATE TABLE IF NOT EXISTS derm_ext_assessments (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES derm_ext_admissions(id),
  score JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS derm_ext_orders (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES derm_ext_admissions(id),
  order_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS derm_ext_audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event TEXT NOT NULL,
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_derm_ext_audit_tenant ON derm_ext_audit_log(tenant_id);
-- Engine functions used: PsoriasisPASISeverity, EczemaSCORADSeverity, MelanomaStaging, AcneGlobalSeverity, StevensJohnsonSpectrum, HidradenitisSuppurativaHurley, VitiligoExtent, BasalCellCarcinomaRisk, AtopicDermatitisEASI, DiabeticFootUlcerRisk
