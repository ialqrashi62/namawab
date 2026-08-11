-- Migration UP for Urogynecology (DEP-038)
-- Generated: 2026-08-08
-- Series: urogyn_001
BEGIN;

-- Tables (see 13_data_erd.sql for full schema)
CREATE TABLE IF NOT EXISTS urogyn_encounters (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE urogyn_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE urogyn_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY urogyn_enc_iso ON urogyn_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

-- Audit log
CREATE TABLE IF NOT EXISTS urogyn_audit (
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
ALTER TABLE urogyn_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE urogyn_audit FORCE ROW LEVEL SECURITY;
CREATE POLICY urogyn_audit_iso ON urogyn_audit
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

COMMIT;