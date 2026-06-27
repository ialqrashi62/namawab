-- ============================================================
-- rls_groupA_candidate_validate.sql  —  READ-ONLY تحقّق بعد التطبيق.
-- ============================================================
-- 1) عدد جداول المجموعة A المفعّل عليها RLS + FORCE (يجب = 40)
SELECT 'groupA_rls_enabled' AS check, count(*) AS n
FROM pg_class
WHERE relnamespace='public'::regnamespace AND relkind='r' AND relrowsecurity AND relforcerowsecurity
AND relname IN (
 'medical_records','medical_records_coding','medical_records_files','medical_records_requests','medical_certificates',
 'pathology_cases','clinical_pharmacy_reviews','patient_drug_education','patient_referrals','emergency_trauma_assessments',
 'admission_daily_rounds','nutrition_assessments','dental_records','mortuary_cases','social_work_cases',
 'telemedicine_sessions','diet_orders','diet_meals','rehab_patients','rehab_assessments',
 'rehab_goals','rehab_sessions','cosmetic_cases','cosmetic_consents','cosmetic_followups',
 'cosmetic_photos','online_bookings','portal_appointments','waiting_queue','hr_employees',
 'hr_salaries','hr_advances','hr_leaves','hr_attendance','hr_employee_custody',
 'hr_employee_documents','employee_exposures','zatca_invoices','quality_incidents','quality_patient_satisfaction');

-- 2) عدد سياسات tenant_isolation للمجموعة A (يجب = 40)
SELECT 'groupA_policies' AS check, count(*) AS n
FROM pg_policies WHERE policyname LIKE 'rls_%_tenant_isolation'
AND tablename IN (
 'medical_records','medical_records_coding','medical_records_files','medical_records_requests','medical_certificates',
 'pathology_cases','clinical_pharmacy_reviews','patient_drug_education','patient_referrals','emergency_trauma_assessments',
 'admission_daily_rounds','nutrition_assessments','dental_records','mortuary_cases','social_work_cases',
 'telemedicine_sessions','diet_orders','diet_meals','rehab_patients','rehab_assessments',
 'rehab_goals','rehab_sessions','cosmetic_cases','cosmetic_consents','cosmetic_followups',
 'cosmetic_photos','online_bookings','portal_appointments','waiting_queue','hr_employees',
 'hr_salaries','hr_advances','hr_leaves','hr_attendance','hr_employee_custody',
 'hr_employee_documents','employee_exposures','zatca_invoices','quality_incidents','quality_patient_satisfaction');

-- 3) أي جدول مجموعة A بلا tenant_id (يجب = 0)
SELECT 'groupA_missing_tenant_id' AS check, count(*) AS n
FROM (VALUES
 ('medical_records'),('medical_records_coding'),('medical_records_files'),('medical_records_requests'),('medical_certificates'),
 ('pathology_cases'),('clinical_pharmacy_reviews'),('patient_drug_education'),('patient_referrals'),('emergency_trauma_assessments'),
 ('admission_daily_rounds'),('nutrition_assessments'),('dental_records'),('mortuary_cases'),('social_work_cases'),
 ('telemedicine_sessions'),('diet_orders'),('diet_meals'),('rehab_patients'),('rehab_assessments'),
 ('rehab_goals'),('rehab_sessions'),('cosmetic_cases'),('cosmetic_consents'),('cosmetic_followups'),
 ('cosmetic_photos'),('online_bookings'),('portal_appointments'),('waiting_queue'),('hr_employees'),
 ('hr_salaries'),('hr_advances'),('hr_leaves'),('hr_attendance'),('hr_employee_custody'),
 ('hr_employee_documents'),('employee_exposures'),('zatca_invoices'),('quality_incidents'),('quality_patient_satisfaction')
) v(t)
LEFT JOIN information_schema.columns c ON c.table_name=v.t AND c.column_name='tenant_id' AND c.table_schema='public'
WHERE c.column_name IS NULL;
