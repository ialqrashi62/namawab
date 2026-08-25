-- filepath: namaweb/migrations/e77_onboarding_up.sql
-- e77 Wave 23: Tenant onboarding state
CREATE TABLE IF NOT EXISTS tenant_onboarding (
    tenant_id       BIGINT PRIMARY KEY,
    step            INTEGER DEFAULT 1,
    facility_type   TEXT DEFAULT '',
    facility_name   TEXT DEFAULT '',
    facility_name_ar TEXT DEFAULT '',
    branch_id       BIGINT,
    modules_enabled JSONB DEFAULT '[]'::jsonb,
    admin_user_id   BIGINT,
    completed       BOOLEAN DEFAULT FALSE,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN BEGIN ALTER TABLE tenant_onboarding ENABLE ROW LEVEL SECURITY; ALTER TABLE tenant_onboarding FORCE ROW LEVEL SECURITY; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'tenant_onboarding RLS exists'; END; END$$;
DO $$
BEGIN BEGIN CREATE POLICY tenant_onboarding_tenant_isolation ON tenant_onboarding USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT) WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::BIGINT); EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'tenant_onboarding policy exists'; END; END$$;