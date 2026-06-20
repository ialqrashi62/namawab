-- ============================================================================
-- P0 Tenant Isolation — Modern Modules — UP (apply)
-- NamaMedical | Phase: P0_TENANT_ISOLATION_GAP_REMEDIATION
-- ----------------------------------------------------------------------------
-- يضيف tenant_id (+ facility_id حيث يلزم) للموديولات الحديثة الحساسة،
-- يعبّئ المستأجر الافتراضي (1)، ويفعّل RLS + FORCE RLS + الفهارس.
-- idempotent: آمن لإعادة التشغيل (IF NOT EXISTS / DROP POLICY IF EXISTS).
-- لا أسرار، لا بيانات نسخ احتياطي.
-- ⚠️ لا يُطبّق على الإنتاج إلا بموافقة صريحة منفصلة + نسخة احتياطية مسبقة.
-- ============================================================================
BEGIN;

-- الموجة 1: الموديولات المسمّاة (Class A)
DO $$
DECLARE
    t TEXT;
    wave1 TEXT[] := ARRAY[
        'medical_records_files','medical_records_requests','medical_records_coding',
        'clinical_pharmacy_reviews','patient_drug_education',
        'rehab_patients','rehab_sessions','rehab_goals','rehab_assessments',
        'portal_users',
        'diet_orders','diet_meals','nutrition_assessments'
    ];
BEGIN
    FOREACH t IN ARRAY wave1 LOOP
        -- إضافة الأعمدة (idempotent)
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS tenant_id INTEGER', t);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS facility_id INTEGER', t);
        -- backfill للمستأجر الافتراضي (single-tenant حالياً)
        EXECUTE format('UPDATE %I SET tenant_id = 1 WHERE tenant_id IS NULL', t);
        EXECUTE format('UPDATE %I SET facility_id = 1 WHERE facility_id IS NULL', t);
        -- فهرس tenant_id
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_tenant ON %I(tenant_id)', t, t);
        -- تفعيل RLS + FORCE RLS
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
        -- السياسة (drop ثم create لـ idempotency)
        EXECUTE format('DROP POLICY IF EXISTS rls_%s_tenant_isolation ON %I', t, t);
        EXECUTE format(
            'CREATE POLICY rls_%s_tenant_isolation ON %I '
            'USING (tenant_id = NULLIF(current_setting(''app.tenant_id'', true), '''')::integer) '
            'WITH CHECK (tenant_id = NULLIF(current_setting(''app.tenant_id'', true), '''')::integer)',
            t, t);
    END LOOP;
END $$;

COMMIT;

-- ============================================================================
-- الموجة 2 (مُعدّة — تُطبّق في نشر لاحق بعد إصلاح كود بنك الدم/الموافقات):
--   blood_bank_units, blood_bank_donors, blood_bank_crossmatch,
--   blood_bank_transfusions, approvals, package_sessions
-- نفس النمط أعلاه. مُعلّقة الآن لأن الكود لم يُحدّث بعد لهذه الموديولات.
-- ============================================================================
