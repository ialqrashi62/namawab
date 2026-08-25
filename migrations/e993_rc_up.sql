-- filepath: migrations/e993_rc_up.sql
-- TIER8_RC_EXT 101-106 Revenue Cycle tables

CREATE TABLE IF NOT EXISTS tier8_rc_coding (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  encounter_id TEXT,
  cpt_range TEXT,
  hcc_count INTEGER,
  hcc_weighted DOUBLE PRECISION,
  severity TEXT,
  complexity TEXT,
  audit_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier8_rc_coding ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier8_rc_coding FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier8_rc_coding_tenant ON tier8_rc_coding;
CREATE POLICY tier8_rc_coding_tenant ON tier8_rc_coding USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier8_rc_coding_tenant_idx ON tier8_rc_coding (tenant_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier8_rc_claims (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  claim_id TEXT,
  patient_id TEXT,
  payer_id TEXT,
  claim_type TEXT,
  total_charge DOUBLE PRECISION,
  validation TEXT,
  submission_status TEXT,
  priority TEXT,
  reconciliation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier8_rc_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier8_rc_claims FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier8_rc_claims_tenant ON tier8_rc_claims;
CREATE POLICY tier8_rc_claims_tenant ON tier8_rc_claims USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier8_rc_claims_tenant_idx ON tier8_rc_claims (tenant_id, claim_type, created_at DESC);

CREATE TABLE IF NOT EXISTS tier8_rc_denials (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  denial_id TEXT,
  reason TEXT,
  amount DOUBLE PRECISION,
  action TEXT,
  recovery_summary TEXT,
  priority TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier8_rc_denials ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier8_rc_denials FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier8_rc_denials_tenant ON tier8_rc_denials;
CREATE POLICY tier8_rc_denials_tenant ON tier8_rc_denials USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier8_rc_denials_tenant_idx ON tier8_rc_denials (tenant_id, reason, created_at DESC);

CREATE TABLE IF NOT EXISTS tier8_rc_payments (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  payment_id TEXT,
  payer_id TEXT,
  amount DOUBLE PRECISION,
  posting_status TEXT,
  reconciliation TEXT,
  refund_status TEXT,
  batch_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier8_rc_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier8_rc_payments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier8_rc_payments_tenant ON tier8_rc_payments;
CREATE POLICY tier8_rc_payments_tenant ON tier8_rc_payments USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier8_rc_payments_tenant_idx ON tier8_rc_payments (tenant_id, posting_status, created_at DESC);

CREATE TABLE IF NOT EXISTS tier8_rc_billing (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  estimate_balance DOUBLE PRECISION,
  cycle TEXT,
  plan_feasibility TEXT,
  charity_eligibility TEXT,
  collection_action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier8_rc_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier8_rc_billing FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier8_rc_billing_tenant ON tier8_rc_billing;
CREATE POLICY tier8_rc_billing_tenant ON tier8_rc_billing USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier8_rc_billing_tenant_idx ON tier8_rc_billing (tenant_id, cycle, created_at DESC);

CREATE TABLE IF NOT EXISTS tier8_rc_finance (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  period TEXT,
  total_ar DOUBLE PRECISION,
  dso DOUBLE PRECISION,
  clean_rate_pct DOUBLE PRECISION,
  margin_pct DOUBLE PRECISION,
  kpi_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier8_rc_finance ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier8_rc_finance FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier8_rc_finance_tenant ON tier8_rc_finance;
CREATE POLICY tier8_rc_finance_tenant ON tier8_rc_finance USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier8_rc_finance_tenant_idx ON tier8_rc_finance (tenant_id, period, created_at DESC);