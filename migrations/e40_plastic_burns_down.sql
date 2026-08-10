-- Rollback: Drop plastic_burns tables and RLS policies.
BEGIN;

DROP TABLE IF EXISTS burn_assessments CASCADE;
DROP TABLE IF EXISTS clinical_photos_meta CASCADE;

COMMIT;
