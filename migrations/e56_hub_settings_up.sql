-- filepath: namaweb/migrations/e56_hub_settings_up.sql
-- e56: Hub API persistence (user preferences, favorites, recent views)
-- Pattern: nm-sql-table-template + FORCE RLS

BEGIN;

CREATE TABLE IF NOT EXISTS hub_user_settings (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    setting_key TEXT NOT NULL,
    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tenant_id, user_id, setting_key)
);

CREATE INDEX IF NOT EXISTS idx_hub_user_settings_user ON hub_user_settings (tenant_id, user_id);

-- FORCE RLS
ALTER TABLE hub_user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_user_settings FORCE ROW LEVEL SECURITY;

-- Policy
DROP POLICY IF EXISTS hub_user_settings_tenant_isolation ON hub_user_settings;
CREATE POLICY hub_user_settings_tenant_isolation ON hub_user_settings
    FOR ALL TO PUBLIC
    USING (current_setting('app.tenant_id', true) <> '' AND tenant_id = current_setting('app.tenant_id', true)::bigint)
    WITH CHECK (current_setting('app.tenant_id', true) <> '' AND tenant_id = current_setting('app.tenant_id', true)::bigint);

-- Favorites (separate table for cleaner queries)
CREATE TABLE IF NOT EXISTS hub_favorites (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    dept_code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tenant_id, user_id, dept_code)
);

CREATE INDEX IF NOT EXISTS idx_hub_favorites_user ON hub_favorites (tenant_id, user_id);

ALTER TABLE hub_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_favorites FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS hub_favorites_tenant_isolation ON hub_favorites;
CREATE POLICY hub_favorites_tenant_isolation ON hub_favorites
    FOR ALL TO PUBLIC
    USING (current_setting('app.tenant_id', true) <> '' AND tenant_id = current_setting('app.tenant_id', true)::bigint)
    WITH CHECK (current_setting('app.tenant_id', true) <> '' AND tenant_id = current_setting('app.tenant_id', true)::bigint);

COMMIT;
