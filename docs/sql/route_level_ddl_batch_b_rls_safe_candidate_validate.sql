-- route_level_ddl_batch_b_rls_safe_candidate_validate.sql  (run AFTER up.sql; read-only)
-- PASS = 8 tables exist; all 8 FORCE RLS + tenant policy + tenant_id DEFAULT; 0 rows; app role unchanged.
SELECT 'tables_exist' AS check, count(*)::int AS n_of_8 FROM pg_tables
 WHERE tablename IN ('pathology_specimens','cssd_batches','cme_events','infection_control_reports','maintenance_orders','insurance_policies','inventory','pharmacy_prescriptions');
SELECT relname, relrowsecurity, relforcerowsecurity FROM pg_class
 WHERE relname IN ('pathology_specimens','cssd_batches','cme_events','infection_control_reports','maintenance_orders','insurance_policies','inventory','pharmacy_prescriptions') ORDER BY relname;
SELECT tablename, policyname FROM pg_policies
 WHERE tablename IN ('pathology_specimens','cssd_batches','cme_events','infection_control_reports','maintenance_orders','insurance_policies','inventory','pharmacy_prescriptions') ORDER BY tablename;
SELECT table_name, (column_default LIKE '%app.tenant_id%') AS tenant_default_ok FROM information_schema.columns
 WHERE column_name='tenant_id' AND table_name IN ('pathology_specimens','cssd_batches','cme_events','infection_control_reports','maintenance_orders','insurance_policies','inventory','pharmacy_prescriptions') ORDER BY table_name;
SELECT 'pathology_specimens' t, count(*)::int n FROM pathology_specimens
 UNION ALL SELECT 'cssd_batches', count(*)::int FROM cssd_batches
 UNION ALL SELECT 'cme_events', count(*)::int FROM cme_events
 UNION ALL SELECT 'infection_control_reports', count(*)::int FROM infection_control_reports
 UNION ALL SELECT 'maintenance_orders', count(*)::int FROM maintenance_orders
 UNION ALL SELECT 'insurance_policies', count(*)::int FROM insurance_policies
 UNION ALL SELECT 'inventory', count(*)::int FROM inventory
 UNION ALL SELECT 'pharmacy_prescriptions', count(*)::int FROM pharmacy_prescriptions;
SELECT rolname, rolsuper, rolbypassrls FROM pg_roles WHERE rolname='nama_medical_app';
-- PASS: n_of_8=8 ; all 8 force=true ; 8 policies ; 8 tenant_default_ok=true ; all counts 0 ; app non-super/non-bypass.
