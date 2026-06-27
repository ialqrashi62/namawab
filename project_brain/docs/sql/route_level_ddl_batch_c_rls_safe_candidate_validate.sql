-- route_level_ddl_batch_c_rls_safe_candidate_validate.sql  (run AFTER up.sql; read-only)
-- PASS = all 8 columns exist on pharmacy_prescriptions_queue; table still FORCE RLS + tenant_id.
SELECT column_name FROM information_schema.columns
 WHERE table_name='pharmacy_prescriptions_queue'
   AND column_name IN ('medication_name','dosage','quantity_per_day','frequency','duration','price','payment_method','doctor')
 ORDER BY column_name;  -- expect 8 rows
SELECT relrowsecurity, relforcerowsecurity FROM pg_class WHERE relname='pharmacy_prescriptions_queue'; -- expect true/true
SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='pharmacy_prescriptions_queue' AND column_name='tenant_id') AS has_tenant_id; -- expect true
