-- 001_mfa_candidate_up.sql
-- CANDIDATE — NOT executed. Adds per-user MFA storage (TOTP). New empty tables; additive; no login change here.
-- user_mfa is keyed by system_users.id (global identity table, no tenant_id). Secret must be stored encrypted at-rest (ties to Phase A3); never logged.
BEGIN;

CREATE TABLE IF NOT EXISTS user_mfa (
  user_id integer PRIMARY KEY,
  mfa_enabled boolean NOT NULL DEFAULT false,
  mfa_secret text,                 -- store encrypted (Phase A3); never expose
  enrolled_at timestamptz,
  last_verified_at timestamptz
);

CREATE TABLE IF NOT EXISTS user_mfa_recovery_codes (
  id serial PRIMARY KEY,
  user_id integer NOT NULL,
  code_hash text NOT NULL,         -- bcrypt/sha256 hash of one-time code
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_mfa_recovery_user ON user_mfa_recovery_codes (user_id);

COMMIT;
-- DO_NOT_EXECUTE on production before approval. Feature-flag (mfa_enabled default false) => deploy forces MFA on nobody until enrollment.
