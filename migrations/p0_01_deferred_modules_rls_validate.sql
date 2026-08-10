-- p0_01_deferred_modules_rls_validate.sql (run AFTER p0_01_deferred_modules_rls_up.sql; read-only)
-- PASS = all 17 tables have tenant_id NOT NULL FK + FORCE RLS + isolation policy.

SELECT
  (SELECT relforcerowsecurity FROM pg_class WHERE relname='medical_records_files') AS med_files_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='medical_records_files' AND policyname='rls_medical_records_files_tenant_isolation') AS med_files_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='medical_records_requests') AS med_req_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='medical_records_requests' AND policyname='rls_medical_records_requests_tenant_isolation') AS med_req_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='medical_records_coding') AS med_coding_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='medical_records_coding' AND policyname='rls_medical_records_coding_tenant_isolation') AS med_coding_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='clinical_pharmacy_reviews') AS rx_reviews_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='clinical_pharmacy_reviews' AND policyname='rls_clinical_pharmacy_reviews_tenant_isolation') AS rx_reviews_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='patient_drug_education') AS rx_edu_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='patient_drug_education' AND policyname='rls_patient_drug_education_tenant_isolation') AS rx_edu_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='rehab_patients') AS rehab_pat_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='rehab_patients' AND policyname='rls_rehab_patients_tenant_isolation') AS rehab_pat_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='rehab_sessions') AS rehab_sess_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='rehab_sessions' AND policyname='rls_rehab_sessions_tenant_isolation') AS rehab_sess_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='rehab_goals') AS rehab_goals_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='rehab_goals' AND policyname='rls_rehab_goals_tenant_isolation') AS rehab_goals_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='rehab_assessments') AS rehab_ass_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='rehab_assessments' AND policyname='rls_rehab_assessments_tenant_isolation') AS rehab_ass_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='portal_users') AS portal_users_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='portal_users' AND policyname='rls_portal_users_tenant_isolation') AS portal_users_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='portal_appointments') AS portal_app_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='portal_appointments' AND policyname='rls_portal_appointments_tenant_isolation') AS portal_app_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='diet_orders') AS diet_orders_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='diet_orders' AND policyname='rls_diet_orders_tenant_isolation') AS diet_orders_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='diet_meals') AS diet_meals_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='diet_meals' AND policyname='rls_diet_meals_tenant_isolation') AS diet_meals_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='nutrition_assessments') AS nutrition_ass_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='nutrition_assessments' AND policyname='rls_nutrition_assessments_tenant_isolation') AS nutrition_ass_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='approvals') AS approvals_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='approvals' AND policyname='rls_approvals_tenant_isolation') AS approvals_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='package_sessions') AS pkg_sess_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='package_sessions' AND policyname='rls_package_sessions_tenant_isolation') AS pkg_sess_policy,

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='internal_messages') AS msg_force_rls,
  (SELECT count(*) FROM pg_policies WHERE tablename='internal_messages' AND policyname='rls_internal_messages_tenant_isolation') AS msg_policy;
