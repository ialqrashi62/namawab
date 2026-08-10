-- p1_01_legacy_core_rls_validate.sql  (run AFTER p1_01_legacy_core_rls_up.sql; read-only)
-- PASS = each of the four legacy core tables has tenant_id NOT NULL + FK -> tenants + FORCE RLS + policy.
SELECT
  (SELECT relforcerowsecurity FROM pg_class WHERE relname='patients')                 AS patients_force_rls,          -- expect t
  (SELECT count(*) FROM pg_policies WHERE tablename='patients'
       AND policyname='rls_patients_tenant_isolation')                                AS patients_policy,             -- expect 1
  (SELECT count(*)::int FROM information_schema.columns WHERE table_name='patients'
       AND column_name='tenant_id' AND is_nullable='NO')                              AS patients_tenant_not_null,    -- expect 1
  (SELECT count(*)::int FROM pg_constraint
       WHERE conrelid='patients'::regclass AND confrelid='tenants'::regclass AND contype='f') AS patients_fk,         -- expect 1

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='invoices')                 AS invoices_force_rls,          -- expect t
  (SELECT count(*) FROM pg_policies WHERE tablename='invoices'
       AND policyname='rls_invoices_tenant_isolation')                                AS invoices_policy,             -- expect 1
  (SELECT count(*)::int FROM information_schema.columns WHERE table_name='invoices'
       AND column_name='tenant_id' AND is_nullable='NO')                              AS invoices_tenant_not_null,    -- expect 1

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='appointments')             AS appointments_force_rls,      -- expect t
  (SELECT count(*) FROM pg_policies WHERE tablename='appointments'
       AND policyname='rls_appointments_tenant_isolation')                            AS appointments_policy,         -- expect 1

  (SELECT relforcerowsecurity FROM pg_class WHERE relname='medical_records')          AS medical_records_force_rls,   -- expect t
  (SELECT count(*) FROM pg_policies WHERE tablename='medical_records'
       AND policyname='rls_medical_records_tenant_isolation')                         AS medical_records_policy;      -- expect 1
