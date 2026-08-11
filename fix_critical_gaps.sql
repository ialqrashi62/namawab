-- Critical Gap Fixes — 2026-08-05
-- Safe: idempotent, transactional

BEGIN;

\echo === FIX-1: schema_migrations table ===
CREATE TABLE IF NOT EXISTS schema_migrations (
    version_num    VARCHAR(64) PRIMARY KEY,
    applied_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description    TEXT,
    checksum       CHAR(64)
);

\echo
\echo === FIX-2: nama_pcc_app role + permissions ===
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='nama_pcc_app') THEN
    CREATE ROLE nama_pcc_app LOGIN PASSWORD 'pcc_sandbox_password';
    RAISE NOTICE 'Created role nama_pcc_app';
  ELSE
    RAISE NOTICE 'Role nama_pcc_app already exists';
  END IF;
END $$;

GRANT USAGE ON SCHEMA public TO nama_pcc_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO nama_pcc_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO nama_pcc_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO nama_pcc_app;

\echo
\echo === Verification ===
SELECT rolname, rolcanlogin FROM pg_roles WHERE rolname LIKE 'nama_%';

SELECT version_num, applied_at FROM schema_migrations ORDER BY version_num LIMIT 5;

SELECT 'schema_migrations_count' AS m, count(*) FROM schema_migrations;

COMMIT;
