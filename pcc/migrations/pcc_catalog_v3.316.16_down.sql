-- pcc_catalog_v3.316.16 down migration
-- Drops all schema objects created in v3.316.16 up
-- Safe: uses IF EXISTS, runs in transaction

BEGIN;

DROP TRIGGER IF EXISTS trg_pcc_catalog_updated_at ON pcc_catalog;
DROP FUNCTION IF EXISTS pcc_touch_updated_at();

DROP INDEX IF EXISTS idx_pcc_catalog_funcs;
DROP INDEX IF EXISTS idx_pcc_catalog_module;
DROP INDEX IF EXISTS idx_pcc_catalog_slug;
DROP TABLE IF EXISTS pcc_catalog;

DROP INDEX IF EXISTS idx_pcc_call_log_called_at;
DROP INDEX IF EXISTS idx_pcc_call_log_decision;
DROP INDEX IF EXISTS idx_pcc_call_log_tenant;
DROP INDEX IF EXISTS idx_pcc_call_log_module;
DROP TABLE IF EXISTS pcc_call_log;

DROP INDEX IF EXISTS idx_pcc_rate_limit_created;
DROP INDEX IF EXISTS idx_pcc_rate_limit_ip;
DROP TABLE IF EXISTS pcc_rate_limit_log;

COMMIT;
