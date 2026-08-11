-- Migration UP for NICU (DEP-023)
-- Generated: 2026-08-08
-- Series: nicu_001
BEGIN;

-- Tables (see 13_data_erd.sql for full schema)
CREATE TABLE IF NOT EXISTS nicu_encounters (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE nicu_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE nicu_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY nicu_enc_iso ON nicu_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

-- Audit log
CREATE TABLE IF NOT EXISTS nicu_audit (
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
ALTER TABLE nicu_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE nicu_audit FORCE ROW LEVEL SECURITY;
CREATE POLICY nicu_audit_iso ON nicu_audit
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

COMMIT;