-- transplant_neph_up.sql — schema for transplant_neph PCC.
CREATE TABLE IF NOT EXISTS transplant_neph_admissions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_transplant_neph_tenant ON transplant_neph_admissions(tenant_id);
CREATE TABLE IF NOT EXISTS transplant_neph_assessments (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES transplant_neph_admissions(id),
  score JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS transplant_neph_orders (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES transplant_neph_admissions(id),
  order_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS transplant_neph_audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event TEXT NOT NULL,
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_transplant_neph_audit_tenant ON transplant_neph_audit_log(tenant_id);
-- Engine functions: KDIGOAKIStage, KidneyTransplantEPTS, DonorKidneyKDPI, BanffRejectionClassification, DialysisAdequacyKtV, BKNephropathyRisk, NephroticSyndromeRelapse, CKDMineralBone, RenalArteryStenosis, DSAManagement
