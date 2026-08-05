-- pcc_api_tokens_v3.316.25 — durable bearer token storage
-- Generated: 2026-07-29
-- Phase: PCC Sandbox v3.316.25
-- Purpose: persist API tokens in PostgreSQL so they survive restarts.
--   Replaces the in-memory Map used in v3.316.24.
-- Safety: idempotent (CREATE IF NOT EXISTS), transactional

BEGIN;

CREATE TABLE IF NOT EXISTS pcc_api_tokens (
    id              BIGSERIAL PRIMARY KEY,
    token           TEXT UNIQUE NOT NULL,
    label           TEXT NOT NULL DEFAULT 'default',
    issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked_at      TIMESTAMPTZ,
    created_by      TEXT
);

CREATE INDEX IF NOT EXISTS idx_pcc_api_tokens_token     ON pcc_api_tokens(token);
CREATE INDEX IF NOT EXISTS idx_pcc_api_tokens_expires  ON pcc_api_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_pcc_api_tokens_revoked  ON pcc_api_tokens(revoked_at);

COMMIT;

-- Verification:
-- SELECT COUNT(*) FROM pcc_api_tokens;       -- expect 0 initially
-- SELECT token, label, expires_at FROM pcc_api_tokens WHERE revoked_at IS NULL;