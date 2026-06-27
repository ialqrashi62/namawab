-- ============================================================
-- phi_class_a_residual_rls_candidate_down.sql
-- CANDIDATE ROLLBACK — DO NOT EXECUTE WITHOUT APPROVAL.
-- يتراجع عن phi_class_a_residual_rls_candidate_up.sql.
-- آمن: إسقاط السياسات + تعطيل RLS + إسقاط الأعمدة المضافة (المجموعة 2 فقط).
-- ============================================================
BEGIN;

-- المجموعة 1: تعطيل RLS + إسقاط السياسة (يُبقي tenant_id كما كان)
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['portal_users','audit_trail'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'rls_'||t||'_tenant_isolation', t);
    EXECUTE format('ALTER TABLE %I NO FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

-- المجموعة 2: تعطيل RLS + إسقاط السياسة + إسقاط الأعمدة المضافة (آمن لأن الجداول كانت فارغة)
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['packages','blood_bank_donors','blood_bank_units'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'rls_'||t||'_tenant_isolation', t);
    EXECUTE format('ALTER TABLE %I NO FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP INDEX IF EXISTS idx_%s_tenant', t);
    EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS tenant_id', t);
    EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS facility_id', t);
  END LOOP;
END $$;

COMMIT;
