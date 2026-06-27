-- route_level_ddl_batch_c_rls_safe_candidate_up.sql
-- CANDIDATE ONLY — NOT executed. Out-of-band (SUPERUSER) replacement for the .catch(()=>{})-swallowed
-- ALTER ADD COLUMN statements inside pharmacy_prescriptions_queue routes (POST /api/prescriptions,
-- PUT /api/pharmacy/queue/:id) and the startup IIFE 'doctor' column. The table ALREADY exists with
-- tenant_id + FORCE RLS (0 rows) — no RLS decision needed here; only the additive columns move out of code.
-- Idempotent. No seed, no backfill, no GRANT, no RLS/role change.
BEGIN;
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS medication_name  TEXT DEFAULT '';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS dosage           TEXT DEFAULT '';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS quantity_per_day TEXT DEFAULT '1';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS frequency        TEXT DEFAULT '';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS duration         TEXT DEFAULT '';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS price            REAL DEFAULT 0;
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS payment_method   TEXT DEFAULT '';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS doctor           TEXT DEFAULT '';
COMMIT;
