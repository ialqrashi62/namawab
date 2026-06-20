-- ============================================================================
-- P0 Tenant Isolation — Wave 2 — DOWN (rollback) — Class A
-- يلغي RLS/السياسات/الفهارس. لا يحذف الأعمدة افتراضياً (آمن).
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
        EXECUTE format('DROP POLICY IF EXISTS rls_%s_tenant_isolation ON %I', t, t);
        EXECUTE format('ALTER TABLE %I NO FORCE ROW LEVEL SECURITY', t);
        EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP INDEX IF EXISTS idx_%s_tenant', t);
        -- اختياري (تدمير بيانات — مُعطّل):
        -- EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS tenant_id', t);
        -- EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS facility_id', t);
    END LOOP;
END $$;

COMMIT;
