-- ============================================================
-- app_runtime_role_rollback_notes.sql  —  ملاحظات استرجاع دور التشغيل.
-- لا يُنفَّذ تلقائياً. الاسترجاع الأساسي في الإنتاج = إعادة DB_USER إلى الدور السابق (postgres)
-- ثم إعادة تشغيل التطبيق؛ هذا فوري ولا يحتاج لمس البيانات.
-- ============================================================

-- إعادة الصلاحيات الافتراضية المضافة:
-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE SELECT,INSERT,UPDATE,DELETE ON TABLES FROM nama_medical_app;
-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE USAGE,SELECT,UPDATE ON SEQUENCES FROM nama_medical_app;
-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM nama_medical_app;

-- سحب الصلاحيات الحالية:
-- REVOKE ALL ON ALL TABLES IN SCHEMA public FROM nama_medical_app;
-- REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM nama_medical_app;
-- REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM nama_medical_app;
-- REVOKE USAGE ON SCHEMA public FROM nama_medical_app;

-- حذف الدور (بعد التأكد أن لا اتصال يستخدمه):
-- DROP ROLE IF EXISTS nama_medical_app;

-- تنبيه: لا تحذف الدور أثناء اتصال التطبيق به. أوقف/أعد توجيه DB_USER أولاً.
