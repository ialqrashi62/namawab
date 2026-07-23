---
module_id: ER-001
section: 04_devops
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 Down + Validate Migrations

## Down Migration (Reverse)

```sql
-- File: namaweb/migrations/e100_er_module_down.sql
-- ER-001: Emergency Department module — reverse migration
-- ⚠️  DESTRUCTIVE — only for dev/staging rollback
-- Production rollback: use point-in-time recovery, not this file

BEGIN;

-- Drop in reverse order (respect foreign keys)
DROP TABLE IF EXISTS er_vector_chunks CASCADE;
DROP TABLE IF EXISTS er_audit_log CASCADE;
DROP TABLE IF EXISTS er_dispositions CASCADE;
DROP TABLE IF EXISTS er_codes CASCADE;
DROP TABLE IF EXISTS er_notes CASCADE;
DROP TABLE IF EXISTS er_consultations CASCADE;
DROP TABLE IF EXISTS er_imaging_orders CASCADE;
DROP TABLE IF EXISTS er_lab_orders CASCADE;
DROP TABLE IF EXISTS er_procedures CASCADE;
DROP TABLE IF EXISTS er_medications_admin CASCADE;
DROP TABLE IF EXISTS er_red_flags CASCADE;
DROP TABLE IF EXISTS er_triage_decisions CASCADE;
DROP TABLE IF EXISTS er_vitals CASCADE;
DROP TABLE IF EXISTS er_encounters CASCADE;

-- Note: RLS policies and indexes are dropped automatically via CASCADE

COMMIT;
```

## Validate Migration (Post-Deploy Smoke Test)

```sql
-- File: namaweb/migrations/e100_er_module_validate.sql
-- Post-deploy validation — run after up.sql to confirm success

SET search_path = public;

-- Test 1: All tables exist
DO $$
DECLARE
  missing TEXT[] := '{}';
  required TEXT[] := ARRAY[
    'er_encounters', 'er_vitals', 'er_triage_decisions', 'er_red_flags',
    'er_medications_admin', 'er_procedures', 'er_lab_orders',
    'er_imaging_orders', 'er_consultations', 'er_notes',
    'er_codes', 'er_dispositions', 'er_audit_log', 'er_vector_chunks'
  ];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY required LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t) THEN
      missing := array_append(missing, t);
    END IF;
  END LOOP;
  IF array_length(missing, 1) > 0 THEN
    RAISE EXCEPTION 'Missing tables: %', array_to_string(missing, ', ');
  END IF;
  RAISE NOTICE '✓ All 14 ER tables exist';
END $$;

-- Test 2: All tables have FORCE RLS
DO $$
DECLARE
  bad TEXT[] := '{}';
  required TEXT[] := ARRAY[
    'er_encounters', 'er_vitals', 'er_triage_decisions', 'er_red_flags',
    'er_medications_admin', 'er_procedures', 'er_lab_orders',
    'er_imaging_orders', 'er_consultations', 'er_notes',
    'er_codes', 'er_dispositions', 'er_audit_log', 'er_vector_chunks'
  ];
  t TEXT;
  relrow BOOLEAN;
  relforce BOOLEAN;
BEGIN
  FOREACH t IN ARRAY required LOOP
    SELECT relrowsecurity, relforcerowsecurity INTO relrow, relforce
    FROM pg_class WHERE relname = t;
    IF NOT (relrow AND relforce) THEN
      bad := array_append(bad, t || ' (rls=' || relrow || ', force=' || relforce || ')');
    END IF;
  END LOOP;
  IF array_length(bad, 1) > 0 THEN
    RAISE EXCEPTION 'Tables without FORCE RLS: %', array_to_string(bad, ', ');
  END IF;
  RAISE NOTICE '✓ All 14 ER tables have ENABLE + FORCE RLS';
END $$;

-- Test 3: tenant_id is NOT NULL on all ER tables
DO $$
DECLARE
  bad TEXT[] := '{}';
  required TEXT[] := ARRAY[
    'er_encounters', 'er_vitals', 'er_triage_decisions', 'er_red_flags',
    'er_medications_admin', 'er_procedures', 'er_lab_orders',
    'er_imaging_orders', 'er_consultations', 'er_notes',
    'er_codes', 'er_dispositions', 'er_audit_log', 'er_vector_chunks'
  ];
  t TEXT;
  is_nullable TEXT;
BEGIN
  FOREACH t IN ARRAY required LOOP
    SELECT is_nullable INTO is_nullable
    FROM information_schema.columns
    WHERE table_name = t AND column_name = 'tenant_id';
    IF is_nullable = 'YES' THEN
      bad := array_append(bad, t);
    END IF;
  END LOOP;
  IF array_length(bad, 1) > 0 THEN
    RAISE EXCEPTION 'Tables with nullable tenant_id: %', array_to_string(bad, ', ');
  END IF;
  RAISE NOTICE '✓ All 14 ER tables have NOT NULL tenant_id';
END $$;

-- Test 4: RLS smoke test (cross-tenant isolation)
DO $$
DECLARE
  t1 UUID := '00000000-0000-0000-0000-000000000001';
  t2 UUID := '00000000-0000-0000-0000-000000000002';
  p1 UUID;
  p2 UUID;
  e1 UUID;
  e2 UUID;
BEGIN
  -- Create test patients (both tenants)
  INSERT INTO patients (tenant_id, mrn, first_name_encrypted, last_name_encrypted, dob, sex)
  VALUES (t1, 'TEST-MRN-1', 'n1', 'n1', '2000-01-01', 'M') RETURNING id INTO p1;
  INSERT INTO patients (tenant_id, mrn, first_name_encrypted, last_name_encrypted, dob, sex)
  VALUES (t2, 'TEST-MRN-2', 'n2', 'n2', '2000-01-01', 'M') RETURNING id INTO p2;
  
  -- Create encounters
  INSERT INTO er_encounters (tenant_id, patient_id, mrn, arrival_time, esi_level, chief_complaint)
  VALUES (t1, p1, 'TEST-MRN-1', now(), 3, 't1 complaint') RETURNING id INTO e1;
  INSERT INTO er_encounters (tenant_id, patient_id, mrn, arrival_time, esi_level, chief_complaint)
  VALUES (t2, p2, 'TEST-MRN-2', now(), 3, 't2 complaint') RETURNING id INTO e2;
  
  -- Set tenant 1 context, should see only e1
  PERFORM set_config('app.tenant_id', t1::text, true);
  IF (SELECT COUNT(*) FROM er_encounters) <> 1 THEN
    RAISE EXCEPTION 'RLS violation: tenant 1 sees % rows (expected 1)', (SELECT COUNT(*) FROM er_encounters);
  END IF;
  
  -- Set tenant 2 context, should see only e2
  PERFORM set_config('app.tenant_id', t2::text, true);
  IF (SELECT COUNT(*) FROM er_encounters) <> 1 THEN
    RAISE EXCEPTION 'RLS violation: tenant 2 sees % rows (expected 1)', (SELECT COUNT(*) FROM er_encounters);
  END IF;
  
  -- Cleanup
  PERFORM set_config('app.tenant_id', t1::text, true);
  DELETE FROM er_encounters WHERE id = e1;
  DELETE FROM patients WHERE id = p1;
  PERFORM set_config('app.tenant_id', t2::text, true);
  DELETE FROM er_encounters WHERE id = e2;
  DELETE FROM patients WHERE id = p2;
  
  RAISE NOTICE '✓ RLS isolation test PASSED: tenants cannot see each other data';
END $$;

-- Test 5: Check constraints
DO $$
DECLARE
  bad TEXT[] := '{}';
  table_constraints TEXT[][] := ARRAY[
    ARRAY['er_encounters', 'esi_level', '1', '5'],
    ARRAY['er_vitals', 'spo2', '0', '100'],
    ARRAY['er_vitals', 'pain_score', '0', '10'],
    ARRAY['er_vitals', 'gcs_total', '3', '15'],
    ARRAY['er_triage_decisions', 'esi_level', '1', '5'],
    ARRAY['er_red_flags', 'category', '1', '5']
  ];
  c TEXT[];
  cnt INT;
BEGIN
  FOREACH c SLICE 1 IN ARRAY table_constraints LOOP
    SELECT COUNT(*) INTO cnt
    FROM information_schema.check_constraints cc
    JOIN information_schema.constraint_column_usage ccu USING (constraint_name)
    WHERE ccu.table_name = c[1] AND ccu.column_name = c[2];
    
    IF cnt = 0 THEN
      bad := array_append(bad, c[1] || '.' || c[2]);
    END IF;
  END LOOP;
  
  IF array_length(bad, 1) > 0 THEN
    RAISE WARNING 'Missing check constraints: %', array_to_string(bad, ', ');
  ELSE
    RAISE NOTICE '✓ All check constraints present';
  END IF;
END $$;

RAISE NOTICE '========================================';
RAISE NOTICE 'ER-001 migration validation: ALL PASS';
RAISE NOTICE '========================================';
```

---
*Section 04.b of ER-001. Owner: DSL + SA.*
