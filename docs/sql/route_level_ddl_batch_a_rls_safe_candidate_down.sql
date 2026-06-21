-- route_level_ddl_batch_a_rls_safe_candidate_down.sql
-- Rollback for the RLS-safe Batch A up.sql. These 6 tables are NEWLY created by up.sql and are EMPTY
-- at deploy time, so dropping them is a clean revert IF run before any route writes data to them.
-- SAFETY: run only immediately post-deploy (pre-data). Dropping a table also drops its RLS policy.
-- If data has since been written, do NOT run this (would lose data) — handle manually.
BEGIN;
DROP TABLE IF EXISTS obgyn_pregnancies;
DROP TABLE IF EXISTS obgyn_deliveries;
DROP TABLE IF EXISTS referrals;
DROP TABLE IF EXISTS medical_reports;
DROP TABLE IF EXISTS visit_lifecycle;
DROP TABLE IF EXISTS cash_drawer;
COMMIT;
