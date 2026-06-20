-- ============================================================================
-- P0 Tenant Isolation — Wave 2 — UP (apply) — Class A only
-- NamaMedical | المرحلة: P0_TENANT_ISOLATION_WAVE2
-- ----------------------------------------------------------------------------
-- النطاق: الجداول التي تفتقر tenant_id وتحتاج DDL (blood_bank + approvals + package_sessions).
-- ⚠️ Class B (telemedicine/pathology/social_work/mortuary/zatca) لا يحتاج SQL — أعمدته موجودة،
--    أُصلح كودياً ونُشر بأمان (لا DDL).
-- idempotent. لا أسرار، لا بيانات نسخ احتياطي.
-- ⚠️ لا يُطبّق على الإنتاج إلا بموافقة صريحة منفصلة + نسخة احتياطية مسبقة (Wave 2b).
-- ============================================================================
BEGIN;

DO $$
DECLARE
    t TEXT;
    classA TEXT[] := ARRAY[
        'blood_bank_units','blood_bank_donors','blood_bank_crossmatch','blood_bank_transfusions',
        'approvals','package_sessions'
    ];
BEGIN
    FOREACH t IN ARRAY classA LOOP
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS tenant_id INTEGER', t);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS facility_id INTEGER', t);
        EXECUTE format('UPDATE %I SET tenant_id = 1 WHERE tenant_id IS NULL', t);
        EXECUTE format('UPDATE %I SET facility_id = 1 WHERE facility_id IS NULL', t);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_tenant ON %I(tenant_id)', t, t);
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP POLICY IF EXISTS rls_%s_tenant_isolation ON %I', t, t);
        EXECUTE format(
            'CREATE POLICY rls_%s_tenant_isolation ON %I '
            'USING (tenant_id = NULLIF(current_setting(''app.tenant_id'', true), '''')::integer) '
            'WITH CHECK (tenant_id = NULLIF(current_setting(''app.tenant_id'', true), '''')::integer)',
            t, t);
    END LOOP;
END $$;

COMMIT;

-- ملاحظة: تطبيق هذا السكربت يجب أن يقترن بنشر كود server.js المعدّل لمسارات
-- blood_bank / approvals / packages (لم تُعدّل بعد في الكود — تُنفّذ في Wave 2b).
