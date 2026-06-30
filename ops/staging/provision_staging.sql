-- provision_staging.sql — create the ISOLATED staging role + database for Jumanasoft.
-- TEMPLATE — NOT executed by the agent. Run by DevOps on the STAGING PostgreSQL cluster ONLY
-- (ideally a SEPARATE cluster from production; never the production cluster holding nama_medical_web).
--
-- Run as a cluster admin, passing the password as a psql variable (NEVER hardcode a secret):
--   psql -h <staging_host> -U <admin> -v staging_pw="'CHANGE_ME_STRONG'" -f provision_staging.sql
--
-- Least privilege: NOSUPERUSER, NOBYPASSRLS, NOCREATEDB, NOCREATEROLE. No access to production DB.
\set ON_ERROR_STOP on

-- 1) Staging login role (idempotent). Password supplied via :staging_pw (psql var).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'jumanasoft_staging_user') THEN
    EXECUTE format(
      'CREATE ROLE jumanasoft_staging_user LOGIN PASSWORD %L NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS',
      :'staging_pw'
    );
  END IF;
END $$;

-- 2) Staging database owned by the staging role.
--    NOTE: CREATE DATABASE cannot run inside a transaction/DO block. If it already exists, skip this line.
CREATE DATABASE jumanasoft_staging OWNER jumanasoft_staging_user;

-- 3) Lock down: only the staging role may use the staging DB; revoke PUBLIC.
REVOKE ALL ON DATABASE jumanasoft_staging FROM PUBLIC;
GRANT CONNECT, TEMP ON DATABASE jumanasoft_staging TO jumanasoft_staging_user;

-- 4) Defense-in-depth IF (and only if) staging shares a cluster with production:
--    ensure the staging role can NOT reach the production database. Safe no-op on a separate cluster
--    (the production DB simply won't exist there).
--    ENABLED because this staging shares the production cluster (nama_medical_web present):
REVOKE ALL ON DATABASE nama_medical_web FROM jumanasoft_staging_user;
REVOKE CONNECT ON DATABASE nama_medical_web FROM jumanasoft_staging_user;

-- 5) Verify isolation (read-only; safe to run). Expect: rolsuper=f, rolbypassrls=f.
SELECT rolname, rolsuper, rolbypassrls, rolcreatedb, rolcreaterole
FROM pg_roles WHERE rolname = 'jumanasoft_staging_user';

-- After this: connect AS jumanasoft_staging_user TO jumanasoft_staging, then the app bootstrap
-- (initDatabase) creates the schema; finally run Runbook 4B (e25_up -> validate -> seed -> observe -> smoke).
