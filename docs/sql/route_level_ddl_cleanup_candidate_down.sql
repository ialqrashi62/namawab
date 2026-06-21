-- route_level_ddl_cleanup_candidate_down.sql
-- _up.sql is purely additive (CREATE TABLE IF NOT EXISTS / ADD COLUMN IF NOT EXISTS) and these tables
-- predate this candidate and hold production data. There is NO safe automatic rollback: dropping them
-- would destroy data. This down is a documented NOOP by design.
-- (A deliberate teardown, if ever needed in a throwaway env only, would DROP these tables — intentionally
--  not provided here to avoid any accidental data loss.)
SELECT 'noop — additive route-schema candidate has no safe automatic down' AS down_note;
