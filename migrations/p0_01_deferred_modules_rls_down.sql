-- ============================================================
-- p0_01_deferred_modules_rls_down.sql
-- Rollback for deferred modules RLS enablement.
-- ============================================================
BEGIN;

-- 1. medical_records_files
DROP POLICY IF EXISTS rls_medical_records_files_tenant_isolation ON medical_records_files;
ALTER TABLE medical_records_files NO FORCE ROW LEVEL SECURITY;
ALTER TABLE medical_records_files DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_medical_records_files_tenant_id;
ALTER TABLE medical_records_files DROP CONSTRAINT IF EXISTS fk_medical_records_files_tenant;

-- 2. medical_records_requests
DROP POLICY IF EXISTS rls_medical_records_requests_tenant_isolation ON medical_records_requests;
ALTER TABLE medical_records_requests NO FORCE ROW LEVEL SECURITY;
ALTER TABLE medical_records_requests DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_medical_records_requests_tenant_id;
ALTER TABLE medical_records_requests DROP CONSTRAINT IF EXISTS fk_medical_records_requests_tenant;

-- 3. medical_records_coding
DROP POLICY IF EXISTS rls_medical_records_coding_tenant_isolation ON medical_records_coding;
ALTER TABLE medical_records_coding NO FORCE ROW LEVEL SECURITY;
ALTER TABLE medical_records_coding DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_medical_records_coding_tenant_id;
ALTER TABLE medical_records_coding DROP CONSTRAINT IF EXISTS fk_medical_records_coding_tenant;

-- 4. clinical_pharmacy_reviews
DROP POLICY IF EXISTS rls_clinical_pharmacy_reviews_tenant_isolation ON clinical_pharmacy_reviews;
ALTER TABLE clinical_pharmacy_reviews NO FORCE ROW LEVEL SECURITY;
ALTER TABLE clinical_pharmacy_reviews DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_clinical_pharmacy_reviews_tenant_id;
ALTER TABLE clinical_pharmacy_reviews DROP CONSTRAINT IF EXISTS fk_clinical_pharmacy_reviews_tenant;

-- 5. patient_drug_education
DROP POLICY IF EXISTS rls_patient_drug_education_tenant_isolation ON patient_drug_education;
ALTER TABLE patient_drug_education NO FORCE ROW LEVEL SECURITY;
ALTER TABLE patient_drug_education DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_patient_drug_education_tenant_id;
ALTER TABLE patient_drug_education DROP CONSTRAINT IF EXISTS fk_patient_drug_education_tenant;

-- 6. rehab_patients
DROP POLICY IF EXISTS rls_rehab_patients_tenant_isolation ON rehab_patients;
ALTER TABLE rehab_patients NO FORCE ROW LEVEL SECURITY;
ALTER TABLE rehab_patients DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_rehab_patients_tenant_id;
ALTER TABLE rehab_patients DROP CONSTRAINT IF EXISTS fk_rehab_patients_tenant;

-- 7. rehab_sessions
DROP POLICY IF EXISTS rls_rehab_sessions_tenant_isolation ON rehab_sessions;
ALTER TABLE rehab_sessions NO FORCE ROW LEVEL SECURITY;
ALTER TABLE rehab_sessions DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_rehab_sessions_tenant_id;
ALTER TABLE rehab_sessions DROP CONSTRAINT IF EXISTS fk_rehab_sessions_tenant;

-- 8. rehab_goals
DROP POLICY IF EXISTS rls_rehab_goals_tenant_isolation ON rehab_goals;
ALTER TABLE rehab_goals NO FORCE ROW LEVEL SECURITY;
ALTER TABLE rehab_goals DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_rehab_goals_tenant_id;
ALTER TABLE rehab_goals DROP CONSTRAINT IF EXISTS fk_rehab_goals_tenant;

-- 9. rehab_assessments
DROP POLICY IF EXISTS rls_rehab_assessments_tenant_isolation ON rehab_assessments;
ALTER TABLE rehab_assessments NO FORCE ROW LEVEL SECURITY;
ALTER TABLE rehab_assessments DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_rehab_assessments_tenant_id;
ALTER TABLE rehab_assessments DROP CONSTRAINT IF EXISTS fk_rehab_assessments_tenant;

-- 10. portal_users
DROP POLICY IF EXISTS rls_portal_users_tenant_isolation ON portal_users;
ALTER TABLE portal_users NO FORCE ROW LEVEL SECURITY;
ALTER TABLE portal_users DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_portal_users_tenant_id;
ALTER TABLE portal_users DROP CONSTRAINT IF EXISTS fk_portal_users_tenant;

-- 11. portal_appointments
DROP POLICY IF EXISTS rls_portal_appointments_tenant_isolation ON portal_appointments;
ALTER TABLE portal_appointments NO FORCE ROW LEVEL SECURITY;
ALTER TABLE portal_appointments DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_portal_appointments_tenant_id;
ALTER TABLE portal_appointments DROP CONSTRAINT IF EXISTS fk_portal_appointments_tenant;

-- 12. diet_orders
DROP POLICY IF EXISTS rls_diet_orders_tenant_isolation ON diet_orders;
ALTER TABLE diet_orders NO FORCE ROW LEVEL SECURITY;
ALTER TABLE diet_orders DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_diet_orders_tenant_id;
ALTER TABLE diet_orders DROP CONSTRAINT IF EXISTS fk_diet_orders_tenant;

-- 13. diet_meals
DROP POLICY IF EXISTS rls_diet_meals_tenant_isolation ON diet_meals;
ALTER TABLE diet_meals NO FORCE ROW LEVEL SECURITY;
ALTER TABLE diet_meals DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_diet_meals_tenant_id;
ALTER TABLE diet_meals DROP CONSTRAINT IF EXISTS fk_diet_meals_tenant;

-- 14. nutrition_assessments
DROP POLICY IF EXISTS rls_nutrition_assessments_tenant_isolation ON nutrition_assessments;
ALTER TABLE nutrition_assessments NO FORCE ROW LEVEL SECURITY;
ALTER TABLE nutrition_assessments DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_nutrition_assessments_tenant_id;
ALTER TABLE nutrition_assessments DROP CONSTRAINT IF EXISTS fk_nutrition_assessments_tenant;

-- 15. approvals
DROP POLICY IF EXISTS rls_approvals_tenant_isolation ON approvals;
ALTER TABLE approvals NO FORCE ROW LEVEL SECURITY;
ALTER TABLE approvals DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_approvals_tenant_id;
ALTER TABLE approvals DROP CONSTRAINT IF EXISTS fk_approvals_tenant;

-- 16. package_sessions
DROP POLICY IF EXISTS rls_package_sessions_tenant_isolation ON package_sessions;
ALTER TABLE package_sessions NO FORCE ROW LEVEL SECURITY;
ALTER TABLE package_sessions DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_package_sessions_tenant_id;
ALTER TABLE package_sessions DROP CONSTRAINT IF EXISTS fk_package_sessions_tenant;

-- 17. internal_messages
DROP POLICY IF EXISTS rls_internal_messages_tenant_isolation ON internal_messages;
ALTER TABLE internal_messages NO FORCE ROW LEVEL SECURITY;
ALTER TABLE internal_messages DISABLE ROW LEVEL SECURITY;
DROP INDEX IF EXISTS idx_internal_messages_tenant_id;
ALTER TABLE internal_messages DROP CONSTRAINT IF EXISTS fk_internal_messages_tenant;

COMMIT;
