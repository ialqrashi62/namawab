BEGIN;

-- Add failed_login_attempts column
ALTER TABLE system_users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;

-- Add lockout_until column
ALTER TABLE system_users ADD COLUMN IF NOT EXISTS lockout_until TIMESTAMP WITH TIME ZONE DEFAULT NULL;

COMMIT;
