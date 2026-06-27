-- 001_mfa_candidate_down.sql (rollback — DO_NOT_EXECUTE unless rolling back)
BEGIN;
DROP INDEX IF EXISTS idx_user_mfa_recovery_user;
DROP TABLE IF EXISTS user_mfa_recovery_codes;
DROP TABLE IF EXISTS user_mfa;
COMMIT;
-- Safe: new empty tables. Disabling MFA app-side = set user_mfa.mfa_enabled=false (feature flag) without dropping.
