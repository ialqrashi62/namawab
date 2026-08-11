GRANT SELECT ON ALL TABLES IN SCHEMA public TO nama_medical_backup;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO nama_medical_backup;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO nama_medical_backup;
SELECT count(*) AS grants_count
FROM information_schema.table_privileges
WHERE grantee = 'nama_medical_backup' AND table_schema = 'public' AND privilege_type = 'SELECT';