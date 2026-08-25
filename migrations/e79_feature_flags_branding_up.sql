-- filepath: namaweb/migrations/e79_feature_flags_branding_up.sql
-- e79 Wave 29: Feature flags + tenant branding
CREATE TABLE IF NOT EXISTS feature_flags (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       BIGINT NOT NULL,
    flag_key        TEXT NOT NULL,
    enabled         BOOLEAN DEFAULT FALSE,
    config          JSONB DEFAULT '{}'::jsonb,
    description     TEXT DEFAULT '',
    rollout_pct     INTEGER DEFAULT 100,         -- 0-100, gradual rollout support
    created_by      BIGINT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, flag_key)
);
CREATE INDEX IF NOT EXISTS idx_ff_tenant_key ON feature_flags (tenant_id, flag_key);

DO $$
BEGIN BEGIN ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY; ALTER TABLE feature_flags FORCE ROW LEVEL SECURITY; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'ff RLS exists'; END; END$$;
DO $$
BEGIN BEGIN CREATE POLICY ff_tenant_isolation ON feature_flags USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT) WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::BIGINT); EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'ff policy exists'; END; END$$;

CREATE TABLE IF NOT EXISTS tenant_branding (
    tenant_id       BIGINT PRIMARY KEY,
    logo_url        TEXT DEFAULT '',
    favicon_url     TEXT DEFAULT '',
    primary_color   TEXT DEFAULT '#0f766e',
    secondary_color TEXT DEFAULT '#14b8a6',
    accent_color    TEXT DEFAULT '#f59e0b',
    facility_name_en TEXT DEFAULT '',
    facility_name_ar TEXT DEFAULT '',
    tagline_en      TEXT DEFAULT '',
    tagline_ar      TEXT DEFAULT '',
    contact_email   TEXT DEFAULT '',
    contact_phone   TEXT DEFAULT '',
    website         TEXT DEFAULT '',
    address_en      TEXT DEFAULT '',
    address_ar      TEXT DEFAULT '',
    custom_css      TEXT DEFAULT '',
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN BEGIN ALTER TABLE tenant_branding ENABLE ROW LEVEL SECURITY; ALTER TABLE tenant_branding FORCE ROW LEVEL SECURITY; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'branding RLS exists'; END; END$$;
DO $$
BEGIN BEGIN CREATE POLICY branding_tenant_isolation ON tenant_branding USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT) WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::BIGINT); EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'branding policy exists'; END; END$$;