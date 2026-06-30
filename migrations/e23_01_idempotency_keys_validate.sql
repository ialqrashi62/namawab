-- e23_01_idempotency_keys_validate.sql — must print all_ok = t after a successful up migration.
SELECT
    (to_regclass('public.idempotency_keys') IS NOT NULL)                                          AS table_exists,
    (SELECT relrowsecurity  FROM pg_class WHERE oid = 'public.idempotency_keys'::regclass)        AS rls_enabled,
    (SELECT relforcerowsecurity FROM pg_class WHERE oid = 'public.idempotency_keys'::regclass)    AS rls_forced,
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idempotency_keys_tenant_key_route')       AS unique_index,
    EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'idempotency_keys')                        AS policy_exists,
    (
        to_regclass('public.idempotency_keys') IS NOT NULL
        AND (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.idempotency_keys'::regclass)
        AND (SELECT relforcerowsecurity FROM pg_class WHERE oid = 'public.idempotency_keys'::regclass)
        AND EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idempotency_keys_tenant_key_route')
        AND EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'idempotency_keys')
    ) AS all_ok;
