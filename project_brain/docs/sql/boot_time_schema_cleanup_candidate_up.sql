-- boot_time_schema_cleanup_candidate_up.sql
-- CANDIDATE ONLY — NOT executed by this phase (P0_REMOVE_BOOT_TIME_DDL_AND_SEEDING_FOR_RESTRICTED_ROLE_CANDIDATE).
-- Purpose: out-of-band replacement for the boot-time additive ALTERs that previously ran on every
--          app start (server.js IIFEs, now disabled in production). Run by a SUPERUSER out of runtime
--          if a fresh environment needs these columns. Idempotent. No seed, no data change, no RLS change.
-- These columns already exist in the current production DB (nama_medical_web) — see _validate.sql.
BEGIN;

ALTER TABLE system_users                 ADD COLUMN IF NOT EXISTS last_ip   TEXT DEFAULT '';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS doctor    TEXT DEFAULT '';
ALTER TABLE audit_trail                  ADD COLUMN IF NOT EXISTS user_name TEXT DEFAULT '';
ALTER TABLE audit_trail                  ADD COLUMN IF NOT EXISTS details   TEXT DEFAULT '';

COMMIT;

-- Note: the broader schema (core tables from initDatabase, and per-route CREATE TABLE IF NOT EXISTS
-- blocks) already exists in production and is out of this candidate's scope. The route-level
-- CREATE/ALTER blocks remain in server.js and would fail under nama_medical_app on request; moving
-- them out of route handlers is a separate follow-up (documented in the inventory).
