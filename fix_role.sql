-- Create nama_pcc_app role (non-templated, single statement per row)
CREATE ROLE nama_pcc_app LOGIN PASSWORD 'pcc_sandbox_pw_2026';
GRANT USAGE ON SCHEMA public TO nama_pcc_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO nama_pcc_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO nama_pcc_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO nama_pcc_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO nama_pcc_app;
SELECT rolname, rolcanlogin FROM pg_roles WHERE rolname LIKE 'nama_%';
