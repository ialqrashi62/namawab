-- plast_validate.sql
SELECT count(*) FROM information_schema.tables WHERE table_name LIKE 'plast_%';
