-- ============================================================================
-- P0 Tenant Isolation — Modern Modules — DOWN (rollback)
-- يلغي RLS والسياسات والفهارس. لا يحذف عمود tenant_id افتراضياً (آمن).
-- لحذف الأعمدة أزل التعليق عن قسم DROP COLUMN (تدمير بيانات — احذر).
-- ============================================================================
BEGIN;

DO $$
DECLARE
    t TEXT;
    wave1 TEXT[] := ARRAY[
        'medical_records_files','medical_records_requests','medical_records_coding',
        'clinical_pharmacy_reviews','patient_drug_education',
        'rehab_patients','rehab_sessions','rehab_goals','rehab_assessments',
        'portal_users','diet_orders','diet_meals','nutrition_assessments'
    ];
BEGIN
    FOREACH t IN ARRAY wave1 LOOP
        EXECUTE format('DROP POLICY IF EXISTS rls_%s_tenant_isolation ON %I', t, t);
        EXECUTE format('ALTER TABLE %I NO FORCE ROW LEVEL SECURITY', t);
        EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP INDEX IF EXISTS idx_%s_tenant', t);
        -- اختياري (تدمير بيانات — مُعطّل افتراضياً):
        -- EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS tenant_id', t);
        -- EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS facility_id', t);
    END LOOP;
END $$;

COMMIT;
