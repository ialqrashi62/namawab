-- 001_phi_vault_candidate_up.sql
-- CANDIDATE — NOT executed. PHI file registry + encryption metadata. No keys, no secrets, no data change.
-- pgcrypto column encryption is applied later/selectively with a KMS key at runtime (NOT here).
BEGIN;

-- Registry of PHI files moved out of public/ into the gated vault
CREATE TABLE IF NOT EXISTS phi_files (
  id serial PRIMARY KEY,
  record_type text NOT NULL,
  record_id integer,
  stored_path text NOT NULL,        -- path inside nama_phi_vault (NOT under public/)
  original_name text,
  sha256 text,
  encrypted boolean NOT NULL DEFAULT false,
  uploaded_by_user_id integer,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  tenant_id integer DEFAULT (NULLIF(current_setting('app.tenant_id', true), ''))::integer
);
ALTER TABLE phi_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE phi_files FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_phi_files_tenant_isolation ON phi_files;
CREATE POLICY rls_phi_files_tenant_isolation ON phi_files
  USING (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer)
  WITH CHECK (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer);

-- Encryption metadata (NO keys/secrets — only which fields/algos/key versions)
CREATE TABLE IF NOT EXISTS encryption_metadata (
  id serial PRIMARY KEY,
  scope text NOT NULL,              -- e.g. 'column:system_users.national_id' or 'file:phi_files'
  algorithm text NOT NULL,          -- e.g. 'pgp_sym/aes-256'
  key_version integer NOT NULL DEFAULT 1,
  enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- (pgcrypto extension would be enabled separately by superuser when column encryption is approved)
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- gated; not enabled here

COMMIT;
-- DO_NOT_EXECUTE on production before approval. No keys in this file.
