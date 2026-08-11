-- Migration UP for Inventory_Supply_Chain (DEP-054)
-- Generated: 2026-08-08
-- Series: inventory_001
BEGIN;

-- Tables (see 13_data_erd.sql for full schema)
CREATE TABLE IF NOT EXISTS inventory_encounters (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE inventory_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY inventory_enc_iso ON inventory_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

-- Audit log
CREATE TABLE IF NOT EXISTS inventory_audit (
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
ALTER TABLE inventory_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_audit FORCE ROW LEVEL SECURITY;
CREATE POLICY inventory_audit_iso ON inventory_audit
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

COMMIT;