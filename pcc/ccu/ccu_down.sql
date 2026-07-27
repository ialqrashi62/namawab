-- pcc/ccu/ccu_down.sql
BEGIN;
DROP TABLE IF EXISTS ccu_audit_log CASCADE;
DROP TABLE IF EXISTS ccu_medication_admin CASCADE;
DROP TABLE IF EXISTS ccu_vital_sign CASCADE;
DROP TABLE IF EXISTS ccu_admission CASCADE;
COMMIT;
