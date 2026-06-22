-- 001_missing_modules_candidate_up.sql
-- CANDIDATE ONLY — DO_NOT_EXECUTE. Illustrative DDL for top missing tables (see report 07).
-- Follows the proven NamaMedical pattern: tenant_id + DEFAULT + ENABLE/FORCE RLS + isolation policy.
-- Must be rehearsed on a throwaway DB, backed up, and approved via a dedicated gate before any execution.
BEGIN;

-- EMR finalize/lock signatures (closes P0 EMR sign/lock gap)
CREATE TABLE IF NOT EXISTS document_signatures (
  id serial PRIMARY KEY,
  record_id integer NOT NULL,
  record_type text NOT NULL,
  signer_id integer NOT NULL,
  signed_at timestamptz NOT NULL DEFAULT now(),
  signature_hash text,
  tenant_id integer DEFAULT (NULLIF(current_setting('app.tenant_id', true), ''))::integer
);

-- FHIR resource store (integration layer)
CREATE TABLE IF NOT EXISTS fhir_resources (
  id serial PRIMARY KEY,
  resource_type text NOT NULL,
  resource_id text NOT NULL,
  version integer DEFAULT 1,
  payload jsonb NOT NULL,
  updated_at timestamptz DEFAULT now(),
  tenant_id integer DEFAULT (NULLIF(current_setting('app.tenant_id', true), ''))::integer
);

-- HL7 message log
CREATE TABLE IF NOT EXISTS hl7_messages (
  id serial PRIMARY KEY,
  msg_type text NOT NULL,
  payload text NOT NULL,
  status text DEFAULT 'received',
  created_at timestamptz DEFAULT now(),
  tenant_id integer DEFAULT (NULLIF(current_setting('app.tenant_id', true), ''))::integer
);

-- Apply RLS to each new tenant-sensitive table
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['document_signatures','fhir_resources','hl7_messages'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS rls_%I_tenant_isolation ON %I', t, t);
    EXECUTE format($p$CREATE POLICY rls_%I_tenant_isolation ON %I
      USING (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer)
      WITH CHECK (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer)$p$, t, t);
  END LOOP;
END $$;

COMMIT;
-- DO_NOT_EXECUTE_SQL: this is a documentation candidate only.
