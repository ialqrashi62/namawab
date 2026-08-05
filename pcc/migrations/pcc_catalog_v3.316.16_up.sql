-- pcc_catalog_v3.316.16 — full schema for PCC Sandbox
-- Generated: 2026-07-29
-- Phase: PCC Sandbox v3.316.16
-- Purpose: production-ready schema for jumanasoft.com deployment
--   - pcc_catalog         (module catalog: 1322 modules with functions[] arrays)
--   - pcc_call_log        (per-call audit trail of PCC function invocations)
--   - pcc_rate_limit_log  (per-IP rate-limit ledger for abuse detection)
-- Safety: idempotent (CREATE IF NOT EXISTS, DROP IF EXISTS), transactional

BEGIN;

-- ============================================================================
-- Module catalog
-- ============================================================================
CREATE TABLE IF NOT EXISTS pcc_catalog (
    id              SERIAL PRIMARY KEY,
    module          TEXT UNIQUE NOT NULL,
    url_slug        TEXT UNIQUE NOT NULL,
    version         TEXT NOT NULL,
    function_count  INTEGER NOT NULL CHECK (function_count >= 0),
    functions       JSONB NOT NULL DEFAULT '[]'::jsonb,
    api_base        TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pcc_catalog_slug   ON pcc_catalog(url_slug);
CREATE INDEX IF NOT EXISTS idx_pcc_catalog_module ON pcc_catalog(module);
CREATE INDEX IF NOT EXISTS idx_pcc_catalog_funcs  ON pcc_catalog USING GIN (functions);

-- ============================================================================
-- Call audit log
-- ============================================================================
CREATE TABLE IF NOT EXISTS pcc_call_log (
    id              BIGSERIAL PRIMARY KEY,
    module          TEXT NOT NULL,
    function        TEXT NOT NULL,
    tenant_id       TEXT,
    decision_id     TEXT,
    created_by      TEXT,
    input           JSONB NOT NULL DEFAULT '{}'::jsonb,
    output          JSONB NOT NULL DEFAULT '{}'::jsonb,
    score           NUMERIC,
    called_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_ms     INTEGER
);

CREATE INDEX IF NOT EXISTS idx_pcc_call_log_module        ON pcc_call_log(module);
CREATE INDEX IF NOT EXISTS idx_pcc_call_log_tenant       ON pcc_call_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pcc_call_log_decision     ON pcc_call_log(decision_id);
CREATE INDEX IF NOT EXISTS idx_pcc_call_log_called_at    ON pcc_call_log(called_at DESC);

-- ============================================================================
-- Rate-limit ledger
-- ============================================================================
CREATE TABLE IF NOT EXISTS pcc_rate_limit_log (
    id              BIGSERIAL PRIMARY KEY,
    ip              TEXT NOT NULL,
    endpoint        TEXT NOT NULL,
    bucket_start    TIMESTAMPTZ NOT NULL,
    count           INTEGER NOT NULL,
    blocked         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pcc_rate_limit_ip       ON pcc_rate_limit_log(ip, bucket_start);
CREATE INDEX IF NOT EXISTS idx_pcc_rate_limit_created  ON pcc_rate_limit_log(created_at DESC);

-- ============================================================================
-- Auto-update trigger
-- ============================================================================
CREATE OR REPLACE FUNCTION pcc_touch_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_pcc_catalog_updated_at ON pcc_catalog;
CREATE TRIGGER trg_pcc_catalog_updated_at BEFORE UPDATE ON pcc_catalog
    FOR EACH ROW EXECUTE FUNCTION pcc_touch_updated_at();

COMMIT;

-- Verification:
-- SELECT COUNT(*) FROM pcc_catalog;       -- expect 1322
-- SELECT COUNT(*) FROM pcc_call_log;      -- expect 0 initially
-- SELECT COUNT(*) FROM pcc_rate_limit_log;-- expect 0 initially
