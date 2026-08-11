-- Migration UP for Billing_Coding (DEP-057)
-- Generated: 2026-08-08
-- Series: billing_001
BEGIN;

-- Tables (see 13_data_erd.sql for full schema)
CREATE TABLE IF NOT EXISTS billing_encounters (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE billing_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY billing_enc_iso ON billing_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

-- Audit log
CREATE TABLE IF NOT EXISTS billing_audit (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  actor_id BIGINT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id BIGINT,
  prev_hash TEXT,
  curr_hash TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE billing_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_audit FORCE ROW LEVEL SECURITY;
CREATE POLICY billing_audit_iso ON billing_audit
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

COMMIT;