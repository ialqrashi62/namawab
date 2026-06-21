-- ============================================================
-- phi_class_a_residual_rls_candidate_up.sql
-- CANDIDATE ONLY — DO NOT EXECUTE WITHOUT EXPLICIT DDL APPROVAL.
-- يعالج الفجوة المتبقية (Class A) في عزل جداول PHI/الحساسة التي ليست FORCE-RLS.
-- additive + idempotent. لا يحذف بيانات. الهدف: PostgreSQL.
-- ملاحظة فعالية: السياسات تُطبَّق فعلياً فقط عندما يتصل التطبيق بدور غير-superuser
--   (nama_medical_app) — انظر P0_RLS_RUNTIME_ROLE_ENFORCEMENT_RESTORE. تحت postgres تبقى متجاوَزة.
-- نمط السياسة مطابق للـ115 القائمة:
--   USING/CHECK (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer)
-- ============================================================
BEGIN;

-- ---------- المجموعة 1: لديها tenant_id بالفعل — تفعيل RLS فقط (بلا backfill) ----------
-- portal_users (0 صفوف) ، audit_trail (44 صفاً، كلها tenant_id غير NULL — لن تُخفى)
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['portal_users','audit_trail'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=t AND policyname='rls_'||t||'_tenant_isolation') THEN
      EXECUTE format($p$CREATE POLICY %I ON %I FOR ALL
        USING (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer)
        WITH CHECK (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer)$p$,
        'rls_'||t||'_tenant_isolation', t);
    END IF;
  END LOOP;
END $$;

-- ---------- المجموعة 2: بلا tenant_id — إضافة العمود (الجداول فارغة: 0 صفوف، لا backfill) + تفعيل RLS ----------
-- packages ، blood_bank_donors ، blood_bank_units
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['packages','blood_bank_donors','blood_bank_units'] LOOP
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS tenant_id INTEGER', t);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS facility_id INTEGER', t);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_tenant ON %I (tenant_id)', t, t);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=t AND policyname='rls_'||t||'_tenant_isolation') THEN
      EXECUTE format($p$CREATE POLICY %I ON %I FOR ALL
        USING (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer)
        WITH CHECK (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer)$p$,
        'rls_'||t||'_tenant_isolation', t);
    END IF;
  END LOOP;
END $$;

COMMIT;

-- ============================================================
-- تبعية كود مطلوبة بعد التطبيق (خارج هذا الملف):
--  - مسارات الإدراج في packages/blood_bank_donors/blood_bank_units يجب أن تختم tenant_id
--    من الجلسة (حالياً قد لا تفعل لأن العمود لم يكن موجوداً) — تُعالَج كـ code-only منفصل.
-- قرار تصميم لـ audit_trail: هل تُقرأ عابرة للمستأجر من قبل super-admin؟ إن نعم، يلزم
--   استثناء/دور قراءة منفصل بدل سياسة tenant صارمة.
-- ============================================================
