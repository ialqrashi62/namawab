-- e23_01_idempotency_keys_down.sql — rollback for e23_01.
-- Drops the idempotency store. Safe: the table holds only short-lived replay records, no business data.
BEGIN;
DROP TABLE IF EXISTS idempotency_keys;
COMMIT;
