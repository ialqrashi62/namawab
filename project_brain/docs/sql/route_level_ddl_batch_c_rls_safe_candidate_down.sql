-- route_level_ddl_batch_c_rls_safe_candidate_down.sql
-- Additive column-adds on a pre-existing table ⇒ NO safe automatic rollback (dropping columns risks data).
-- Documented NOOP. (Manual teardown, if ever needed in a throwaway env, would DROP these columns — not provided.)
SELECT 'noop — additive column migration has no safe automatic down' AS down_note;
