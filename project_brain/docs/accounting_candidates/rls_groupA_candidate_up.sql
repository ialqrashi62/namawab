-- ============================================================
-- rls_groupA_candidate_up.sql
-- CANDIDATE ONLY — DO NOT EXECUTE IN PRODUCTION WITHOUT APPROVAL + STAGING PASS.
-- يفعّل RLS (tenant isolation) على جداول المجموعة A (الأعلى حساسية: PHI/سريري/HR/تأمين/مالي).
-- النمط مطابق للـ42 جدولاً المُفعَّلة سابقاً:
--   tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer
-- fail-closed (بلا سياق => لا صفوف)؛ ENABLE + FORCE؛ WITH CHECK يمنع الكتابة عبر-المستأجر.
-- آمن معمارياً: التطبيق يربط app.tenant_id لكل pool.query عبر AsyncLocalStorage + pool مغلّف.
-- ============================================================
BEGIN;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'medical_records','medical_records_coding','medical_records_files','medical_records_requests','medical_certificates',
    'pathology_cases','clinical_pharmacy_reviews','patient_drug_education','patient_referrals','emergency_trauma_assessments',
    'admission_daily_rounds','nutrition_assessments','dental_records','mortuary_cases','social_work_cases',
    'telemedicine_sessions','diet_orders','diet_meals','rehab_patients','rehab_assessments',
    'rehab_goals','rehab_sessions','cosmetic_cases','cosmetic_consents','cosmetic_followups',
    'cosmetic_photos','online_bookings','portal_appointments','waiting_queue','hr_employees',
    'hr_salaries','hr_advances','hr_leaves','hr_attendance','hr_employee_custody',
    'hr_employee_documents','employee_exposures','zatca_invoices','quality_incidents','quality_patient_satisfaction'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS rls_%s_tenant_isolation ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY rls_%s_tenant_isolation ON %I FOR ALL '
      || 'USING (tenant_id = (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer) '
      || 'WITH CHECK (tenant_id = (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer)',
      t, t);
  END LOOP;
END $$;
COMMIT;
