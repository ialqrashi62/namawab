-- 23_migration_down.sql
-- Reverse of e50_cardio_v1 — non-destructive, drops only what was created.
-- DANGER: only run with recent backup + owner approval.

BEGIN;

DROP POLICY IF EXISTS cardio_nphies_claims_tenant ON cardio_nphies_claims;
DROP TABLE IF EXISTS cardio_nphies_claims CASCADE;

DROP POLICY IF EXISTS cardio_red_flag_activations_tenant ON cardio_red_flag_activations;
DROP TABLE IF EXISTS cardio_red_flag_activations CASCADE;

DROP POLICY IF EXISTS cardio_copilot_queries_tenant ON cardio_copilot_queries;
DROP TABLE IF EXISTS cardio_copilot_queries CASCADE;

DROP POLICY IF EXISTS cardio_rehab_tenant ON cardio_rehab;
DROP TABLE IF EXISTS cardio_rehab CASCADE;

DROP POLICY IF EXISTS cardio_devices_tenant ON cardio_devices;
DROP TABLE IF EXISTS cardio_devices CASCADE;

DROP POLICY IF EXISTS cardio_cath_tenant ON cardio_cath;
DROP TABLE IF EXISTS cardio_cath CASCADE;

DROP POLICY IF EXISTS cardio_holter_tenant ON cardio_holter;
DROP TABLE IF EXISTS cardio_holter CASCADE;

DROP POLICY IF EXISTS cardio_stress_tenant ON cardio_stress;
DROP TABLE IF EXISTS cardio_stress CASCADE;

DROP POLICY IF EXISTS cardio_echo_tenant ON cardio_echo;
DROP TABLE IF EXISTS cardio_echo CASCADE;

DROP POLICY IF EXISTS cardio_ecg_tenant ON cardio_ecg;
DROP TABLE IF EXISTS cardio_ecg CASCADE;

DROP POLICY IF EXISTS cardio_encounters_tenant ON cardio_encounters;
DROP TABLE IF EXISTS cardio_encounters CASCADE;

COMMIT;
