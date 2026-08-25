-- e383 TIER4_NEPH-107 Kidney Transplant
CREATE TABLE IF NOT EXISTS tier4_neph_107_transplant_eligibility (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  egfr NUMERIC NOT NULL,
  age INT NOT NULL,
  bmi NUMERIC NOT NULL,
  cv_risk TEXT,
  active_malignancy BOOLEAN,
  eligible_for_listing BOOLEAN,
  workup TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_107_transplant_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_107_transplant_eligibility FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_107_transplant_eligibility_t ON tier4_neph_107_transplant_eligibility;
CREATE POLICY tier4_neph_107_transplant_eligibility_t ON tier4_neph_107_transplant_eligibility
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_neph_107_transplant_rejection (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  donor_type TEXT,
  pra_pct NUMERIC,
  dsa_positive BOOLEAN,
  hla_mismatch NUMERIC,
  tacrolimus_adequate BOOLEAN,
  risk TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_107_transplant_rejection ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_107_transplant_rejection FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_107_transplant_rejection_t ON tier4_neph_107_transplant_rejection;
CREATE POLICY tier4_neph_107_transplant_rejection_t ON tier4_neph_107_transplant_rejection
  USING (tenant_id = current_setting('app.tenant_id', true));