-- Wave 27 — Migration baseline: mark all existing _up.sql migrations as applied
-- Safe: idempotent (INSERT ON CONFLICT DO NOTHING)
-- We compute SHA-256 of each file's contents locally via SHA-256 of the file *contents*.
-- Since we are running in psql (no Node), we use a placeholder checksum and let the
-- migrate runner (Node) recompute the real checksum on next run.

INSERT INTO schema_migrations (version_num, description, checksum)
SELECT
  replace(filename, '_up.sql', '') AS version_num,
  'baseline-2026-08-05' AS description,
  '0000000000000000000000000000000000000000000000000000000000000000' AS checksum
FROM (
  SELECT substring(filename FROM '\.[^.]*$') AS fname, filename
  FROM (SELECT unnest(array['e0_01_tenants_archetype_up.sql', 'e0_02_facilities_extend_up.sql']) AS filename) f
) src
ON CONFLICT (version_num) DO NOTHING;

-- Verify count
SELECT count(*) FROM schema_migrations;
