-- Migration UP for Hematology_Oncology (DEP-004)
-- Generated: 2026-08-08
-- Series: hemOnc_001
BEGIN;

-- Tables (see 13_data_erd.sql for full schema)
CREATE TABLE IF NOT EXISTS hemOnc_encounters (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE hemOnc_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE hemOnc_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY hemOnc_enc_iso ON hemOnc_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

-- Audit log
CREATE TABLE IF NOT EXISTS hemOnc_audit (
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
ALTER TABLE hemOnc_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE hemOnc_audit FORCE ROW LEVEL SECURITY;
CREATE POLICY hemOnc_audit_iso ON hemOnc_audit
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

COMMIT;