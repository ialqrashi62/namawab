CREATE ROLE nama_medical_backup WITH LOGIN PASSWORD 'BackupRole2026Secure' BYPASSRLS;
GRANT CONNECT ON DATABASE nama_medical_web TO nama_medical_backup;
GRANT USAGE ON SCHEMA public TO nama_medical_backup;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO nama_medical_backup;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO nama_medical_backup;
SELECT rolname, rolbypassrls, rolcanlogin FROM pg_roles WHERE rolname LIKE 'nama_medical_%';