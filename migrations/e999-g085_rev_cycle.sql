-- migrations/e999-g085_rev_cycle.sql
-- TIER65 Revenue Cycle Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS rev_charge_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  claim_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE rev_charge_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rev_charge_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rev_charge_records_t ON rev_charge_records;
CREATE POLICY rev_charge_records_t ON rev_charge_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS rev_claim_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  claim_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE rev_claim_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rev_claim_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rev_claim_records_t ON rev_claim_records;
CREATE POLICY rev_claim_records_t ON rev_claim_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS rev_payment_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  payment_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE rev_payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rev_payment_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rev_payment_records_t ON rev_payment_records;
CREATE POLICY rev_payment_records_t ON rev_payment_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS rev_audit_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  audit_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE rev_audit_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rev_audit_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rev_audit_records_t ON rev_audit_records;
CREATE POLICY rev_audit_records_t ON rev_audit_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS rev_contract_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  contract_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE rev_contract_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rev_contract_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rev_contract_records_t ON rev_contract_records;
CREATE POLICY rev_contract_records_t ON rev_contract_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
