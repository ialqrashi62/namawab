-- Rollback: Drop gastroenterology tables and RLS policies.
BEGIN;

DROP TABLE IF EXISTS biopsy_samples CASCADE;
DROP TABLE IF EXISTS endoscopy_reports CASCADE;

COMMIT;
