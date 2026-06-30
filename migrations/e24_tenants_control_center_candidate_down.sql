-- e24_tenants_control_center_candidate_down.sql — rollback for the e24 candidate.
-- Removes only the columns added by the candidate up (all new, no business data). Safe.
BEGIN;
ALTER TABLE tenants DROP COLUMN IF EXISTS suspended_reason;
ALTER TABLE tenants DROP COLUMN IF EXISTS suspended_at;
ALTER TABLE tenants DROP COLUMN IF EXISTS trial_ends_at;
ALTER TABLE tenants DROP COLUMN IF EXISTS last_activity_at;
COMMIT;
