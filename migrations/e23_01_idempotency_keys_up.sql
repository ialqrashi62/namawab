-- e23_01_idempotency_keys_up.sql
-- REMEDIATION (GATE12-H): financial idempotency store for ./idempotency.js.
-- Prevents duplicate money mutations (invoice/pay/refund/journal) on double-submit / retry / race by
-- keying on a client Idempotency-Key, scoped per tenant + route. Additive + idempotent (IF NOT EXISTS).
-- RLS tenant-isolated to match the system posture (FORCE + NULLIF(current_setting('app.tenant_id'))).
-- OWNER-RUN. Safe to run on a live DB: only creates a new table + grants (no change to existing data).

BEGIN;

CREATE TABLE IF NOT EXISTS idempotency_keys (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       INTEGER,
    idem_key        TEXT        NOT NULL,
    route           TEXT        NOT NULL,
    status          TEXT        NOT NULL DEFAULT 'in_progress',   -- in_progress | completed
    response_status INTEGER,
    response_body   JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at    TIMESTAMPTZ
);

-- the race arbiter: one (tenant, key, route) at most
CREATE UNIQUE INDEX IF NOT EXISTS idempotency_keys_tenant_key_route
    ON idempotency_keys (tenant_id, idem_key, route);

-- supports TTL cleanup of stale rows
CREATE INDEX IF NOT EXISTS idempotency_keys_created_at ON idempotency_keys (created_at);

-- RLS: tenant isolation (same idiom as the rest of the schema)
ALTER TABLE idempotency_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE idempotency_keys FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_idempotency_keys_tenant_isolation ON idempotency_keys;
CREATE POLICY rls_idempotency_keys_tenant_isolation ON idempotency_keys
    USING      (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- app role privileges (non-superuser, RLS still enforced)
GRANT SELECT, INSERT, UPDATE, DELETE ON idempotency_keys TO nama_medical_app;
GRANT USAGE, SELECT ON SEQUENCE idempotency_keys_id_seq TO nama_medical_app;

COMMIT;
