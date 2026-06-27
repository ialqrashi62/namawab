-- ============================================================
-- rls_groupA_candidate_down.sql
-- CANDIDATE ROLLBACK — يزيل سياسات RLS للمجموعة A ويعطّل RLS عليها. لا يحذف بيانات.
-- الاسترجاع الإنتاجي الفوري عند مشكلة دالّة: إعادة DB_USER إلى postgres (يتجاوز RLS) ثم إعادة تشغيل التطبيق،
-- أو تشغيل هذا الملف لإزالة سياسات المجموعة A فقط.
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
    EXECUTE format('DROP POLICY IF EXISTS rls_%s_tenant_isolation ON %I', t, t);
    EXECUTE format('ALTER TABLE %I NO FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;
COMMIT;
