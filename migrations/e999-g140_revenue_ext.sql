-- filepath: migrations/e999-g140_revenue_ext.sql
CREATE TABLE IF NOT EXISTS tier120_billing_628 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  claim_id TEXT, payment_id TEXT, denial_id TEXT, statement_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier120_billing_628 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier120_billing_628 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t120_billing_628_isolation ON tier120_billing_628;
CREATE POLICY t120_billing_628_isolation ON tier120_billing_628 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier120_coding_629 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  coding_id TEXT, cpt_id TEXT, hcpcs_id TEXT, drg_id TEXT, audit_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier120_coding_629 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier120_coding_629 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t120_coding_629_isolation ON tier120_coding_629;
CREATE POLICY t120_coding_629_isolation ON tier120_coding_629 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier120_revenue_630 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  kpi_id TEXT, contract_id TEXT, snapshot_id TEXT, underpay_id TEXT, writeoff_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier120_revenue_630 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier120_revenue_630 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t120_revenue_630_isolation ON tier120_revenue_630;
CREATE POLICY t120_revenue_630_isolation ON tier120_revenue_630 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier120_patient_finance_631 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  eligibility_id TEXT, auth_id TEXT, application_id TEXT, plan_id TEXT, statement_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier120_patient_finance_631 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier120_patient_finance_631 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t120_pat_fin_631_isolation ON tier120_patient_finance_631;
CREATE POLICY t120_pat_fin_631_isolation ON tier120_patient_finance_631 USING (tenant_id = current_setting('app.tenant_id', true));