BEGIN;
DROP INDEX IF EXISTS idx_pcc_api_tokens_revoked;
DROP INDEX IF EXISTS idx_pcc_api_tokens_expires;
DROP INDEX IF EXISTS idx_pcc_api_tokens_token;
DROP TABLE IF EXISTS pcc_api_tokens;
COMMIT;