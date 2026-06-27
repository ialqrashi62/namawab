-- boot_time_schema_cleanup_candidate_validate.sql
-- Proves the 4 additive columns (previously ensured by boot-time IIFEs) exist.
-- Expect every column = true in production (they already exist; the boot ALTERs were no-ops there).
-- Read-only. Safe to run as any role with catalog read access.
SELECT
  to_regclass('public.system_users')                 IS NOT NULL AS system_users_table_exists,
  to_regclass('public.pharmacy_prescriptions_queue') IS NOT NULL AS ppq_table_exists,
  to_regclass('public.audit_trail')                  IS NOT NULL AS audit_trail_table_exists,
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='system_users'                 AND column_name='last_ip')   AS system_users_last_ip,
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pharmacy_prescriptions_queue' AND column_name='doctor')    AS ppq_doctor,
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_trail'                  AND column_name='user_name') AS audit_user_name,
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_trail'                  AND column_name='details')   AS audit_details;
-- PASS criterion: all 7 columns above = true.
