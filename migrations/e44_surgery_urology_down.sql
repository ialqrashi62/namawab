-- Rollback: Drop surgical checklists, time logs, and urodynamic studies tables and RLS.
BEGIN;

DROP TABLE IF EXISTS surgical_checklists CASCADE;
DROP TABLE IF EXISTS surgical_time_logs CASCADE;
DROP TABLE IF EXISTS urodynamic_studies CASCADE;

COMMIT;
