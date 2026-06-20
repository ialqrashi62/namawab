-- ============================================================
-- app_runtime_role_candidate.sql
-- CANDIDATE ONLY — DO NOT EXECUTE IN PRODUCTION WITHOUT APPROVAL.
-- ينشئ دور تشغيل التطبيق بأقل صلاحية: غير superuser، لا يتجاوز RLS، لا DDL، لا ملكية.
-- الهدف: أن يتصل التطبيق بهذا الدور بدل postgres فتُنفَّذ سياسات RLS فعلياً.
-- الهجرات/الإدارة تبقى على postgres (دور منفصل) — لا تخلط دور الهجرة بدور التشغيل.
-- كلمة المرور تُضبط بقناة آمنة خارج git (انظر السطر المعلّق) — لا تكتب سراً هنا.
-- ============================================================
BEGIN;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nama_medical_app') THEN
    CREATE ROLE nama_medical_app LOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE NOREPLICATION;
  END IF;
END $$;

-- عيّن كلمة المرور بقناة آمنة (خارج git)، مثال (لا تلتزمه):
--   ALTER ROLE nama_medical_app PASSWORD '<set-securely-via-secret-manager>';

-- صلاحيات المخطط والـ DML فقط (لا DDL/TRUNCATE/ملكية)
GRANT USAGE ON SCHEMA public TO nama_medical_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO nama_medical_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO nama_medical_app;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO nama_medical_app;

-- صلاحيات افتراضية للكائنات التي ينشئها postgres لاحقاً (تبقى DML فقط للتطبيق)
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO nama_medical_app;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO nama_medical_app;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO nama_medical_app;

COMMIT;

-- ملاحظات تصميم:
--  - لا BYPASSRLS ولا SUPERUSER => سياسات RLS تُطبَّق على هذا الدور.
--  - لا CREATEDB/CREATEROLE/REPLICATION => سطح هجوم أقل.
--  - DML على كل الجداول مبرَّر لأن التطبيق متجانس يقرأ/يكتب أغلب الجداول؛ يمكن تضييقه لاحقاً لكل موديول.
--  - لا يملك الدور أي جدول => FORCE RLS تنطبق عليه دائماً.
