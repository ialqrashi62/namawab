-- ============================================================
-- rls_group_C_candidate_up.sql
-- CANDIDATE ONLY — DO NOT EXECUTE IN PRODUCTION WITHOUT APPROVAL + PROD-DATA VALIDATION.
-- Group C: جداول إعدادات/مرجعية مختلطة (per-tenant + صفوف عالمية tenant_id IS NULL).
-- سياسة "global-aware": القراءة تشمل صفوف المستأجر + الصفوف العالمية (NULL)؛ الكتابة للمستأجر الحالي فقط.
-- مهم: company_settings يقود حارس استحقاق المنشأة (fail-closed). سياسة صارمة تخفي الصفوف العالمية وتكسره؛
-- لذا نستخدم (tenant_id = ctx OR tenant_id IS NULL) في USING.
-- ⚠️ يتطلب فحص توزيع بيانات الإنتاج قبل التطبيق (نطاق أثر عالٍ على الاستحقاق).
-- ============================================================
BEGIN;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'company_settings','integration_settings','tenant_settings','facilities','pharmacy_drug_catalog','queue_advertisements'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS rls_%s_tenant_isolation ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY rls_%s_tenant_isolation ON %I FOR ALL '
      || 'USING (tenant_id = (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer OR tenant_id IS NULL) '
      || 'WITH CHECK (tenant_id = (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer)',
      t, t);
  END LOOP;
END $$;
COMMIT;
