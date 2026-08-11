-- Migration UP for Cardiothoracic_Surgery (DEP-014)
-- Generated: 2026-08-08
-- Series: cardioTh_001
BEGIN;

-- Tables (see 13_data_erd.sql for full schema)
CREATE TABLE IF NOT EXISTS cardioTh_encounters (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE cardioTh_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardioTh_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY cardioTh_enc_iso ON cardioTh_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

-- Audit log
CREATE TABLE IF NOT EXISTS cardioTh_audit (
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
ALTER TABLE cardioTh_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardioTh_audit FORCE ROW LEVEL SECURITY;
CREATE POLICY cardioTh_audit_iso ON cardioTh_audit
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

COMMIT;