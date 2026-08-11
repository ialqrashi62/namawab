-- Migration UP for Plastic_Burns (DEP-018)
-- Generated: 2026-08-08
-- Series: plastic_001
BEGIN;

-- Tables (see 13_data_erd.sql for full schema)
CREATE TABLE IF NOT EXISTS plastic_encounters (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE plastic_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE plastic_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY plastic_enc_iso ON plastic_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

-- Audit log
CREATE TABLE IF NOT EXISTS plastic_audit (
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
ALTER TABLE plastic_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE plastic_audit FORCE ROW LEVEL SECURITY;
CREATE POLICY plastic_audit_iso ON plastic_audit
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

COMMIT;