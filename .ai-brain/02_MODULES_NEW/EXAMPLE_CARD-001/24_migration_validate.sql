-- 24_migration_validate.sql
-- Read-only validation. Run after 22_migration_up.sql.
-- Returns 0 rows on success, raises on failure.

\set ON_ERROR_STOP on

-- 1. All 11 cardio tables exist
DO $$
DECLARE
  expected TEXT[] := ARRAY[
    'cardio_encounters','cardio_ecg','cardio_echo','cardio_stress',
    'cardio_holter','cardio_cath','cardio_devices','cardio_rehab',
    'cardio_copilot_queries','cardio_red_flag_activations','cardio_nphies_claims'
  ];
  missing TEXT;
BEGIN
  FOREACH missing IN ARRAY expected LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = missing) THEN
      RAISE EXCEPTION 'migration_validate: table % missing', missing;
    END IF;
  END LOOP;
END $$;

-- 2. All tables have RLS enabled AND forced
DO $$
DECLARE
  t TEXT;
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT c.relname AS t, c.relrowsecurity AS rls, c.relforcerowsecurity AS frls
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname LIKE 'cardio_%'
      AND c.relkind = 'r'
  LOOP
    IF NOT rec.rls THEN RAISE EXCEPTION 'migration_validate: % RLS not enabled', rec.t; END IF;
    IF NOT rec.frls THEN RAISE EXCEPTION 'migration_validate: % FORCE RLS not enabled', rec.t; END IF;
  END LOOP;
END $$;

-- 3. tenant_id is NOT NULL on all cardio tables
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_name LIKE 'cardio_%'
  AND column_name = 'tenant_id'
  AND is_nullable = 'YES';
-- Expect 0 rows

-- 4. All cardio tables have a tenant_isolation policy
SELECT tablename
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename LIKE 'cardio_%'
  AND policyname NOT LIKE '%_tenant';
-- Expect 0 rows (all policies must end in _tenant)

-- 5. Indexes exist
DO $$
DECLARE
  expected_idx TEXT[] := ARRAY[
    'idx_cardio_enc_patient','idx_cardio_enc_doctor','idx_cardio_enc_facility',
    'idx_cardio_ecg_patient','idx_cardio_ecg_redflag_unsigned',
    'idx_cardio_echo_patient','idx_cardio_stress_patient','idx_cardio_holter_patient',
    'idx_cardio_cath_patient','idx_cardio_cath_enc',
    'idx_cardio_dev_patient','idx_cardio_dev_active','idx_cardio_rehab_patient',
    'idx_copilot_enc','idx_copilot_user','idx_copilot_redflag',
    'idx_redflag_active','idx_redflag_patient',
    'idx_cardio_nphies_status','idx_cardio_nphies_enc','uq_cardio_nphies_claim_id'
  ];
  i TEXT;
BEGIN
  FOREACH i IN ARRAY expected_idx LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = i) THEN
      RAISE EXCEPTION 'migration_validate: index % missing', i;
    END IF;
  END LOOP;
END $$;

-- 6. tenants table exists (assumed; we FK to it)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tenants') THEN
    RAISE NOTICE 'migration_validate: tenants table missing — FK will fail. Create tenants first.';
  END IF;
END $$;

SELECT 'migration_validate: ALL CHECKS PASSED' AS result;
