BEGIN;

ALTER TABLE system_users DROP COLUMN IF EXISTS failed_login_attempts;
ALTER TABLE system_users DROP COLUMN IF EXISTS lockout_until;

COMMIT;
