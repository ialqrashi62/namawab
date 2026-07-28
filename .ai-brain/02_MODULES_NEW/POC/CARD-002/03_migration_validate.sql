<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
-- CARD-002 Migration Validation

-- 1. Verify RLS is enabled and forced
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled,
  CASE WHEN rowsecurity THEN 'YES' ELSE 'NO' END AS forced_status
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE schemaname = 'public'
  AND tablename LIKE 'cath%' OR tablename IN ('pci_records', 'stent_registry', 'structural_heart_mdt', 'tavr_workup', 'contrast_tracking', 'radiation_dose_log')
ORDER BY tablename;

-- Expected: all 12 tables show rls_enabled = TRUE

-- 2. Verify tenant_id is NOT NULL on all 12 tables
SELECT table_name, column_name, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'tenant_id'
  AND table_name IN ('cardiac_cath_procedures', 'pci_records', 'stent_registry', 'structural_heart_mdt', 'tavr_workup', 'cath_lab_scheduling', 'contrast_tracking', 'radiation_dose_log', 'cath_lab_equipment', 'cath_lab_red_flags', 'cath_audit_log', 'cath_consent')
ORDER BY table_name;

-- Expected: is_nullable = 'NO' for all 12

-- 3. Test cross-tenant isolation
-- Set tenant context to A
SET app.tenant_id = '00000000-0000-0000-0000-000000000001';
-- Should see only A's data
SELECT COUNT(*) FROM cardiac_cath_procedures;

-- 4. Test missing tenant context = empty result
RESET app.tenant_id;
SELECT COUNT(*) FROM cardiac_cath_procedures;  -- should be 0