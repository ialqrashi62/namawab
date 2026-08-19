-- Migration: P0-4_ADVANCED_BILLING (UP)
CREATE TABLE IF NOT EXISTS billing_claims (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  claim_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  payer_id VARCHAR(50),
  encounter_type VARCHAR(50),
  total_amount NUMERIC(12,2),
  services_count INTEGER,
  diagnosis_codes TEXT[],
  status VARCHAR(20) DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ,
  response_at TIMESTAMPTZ,
  created_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bill_claims_tenant ON billing_claims(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bill_claims_patient ON billing_claims(patient_id);
CREATE INDEX IF NOT EXISTS idx_bill_claims_status ON billing_claims(status);
ALTER TABLE billing_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_claims FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bill_claims_tenant_isolation ON billing_claims;
CREATE POLICY bill_claims_tenant_isolation ON billing_claims
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS billing_invoices (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  invoice_id VARCHAR(50) UNIQUE NOT NULL,
  invoice_hash VARCHAR(255),
  invoice_type VARCHAR(20),
  buyer_vat_number VARCHAR(20),
  seller_vat_number VARCHAR(20),
  subtotal NUMERIC(12,2),
  vat_amount NUMERIC(12,2),
  grand_total NUMERIC(12,2),
  qr_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bill_inv_tenant ON billing_invoices(tenant_id);
ALTER TABLE billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_invoices FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bill_inv_tenant_isolation ON billing_invoices;
CREATE POLICY bill_inv_tenant_isolation ON billing_invoices
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));
