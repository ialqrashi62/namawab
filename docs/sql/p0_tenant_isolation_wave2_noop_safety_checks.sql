-- ============================================================================
-- P0 Tenant Isolation — Wave 2 — NO-OP SAFETY CHECKS (read-only)
-- تُشغَّل قبل up.sql. لا تعدّل شيئاً.
-- ============================================================================

-- 1) المستأجر الافتراضي موجود
SELECT id, name FROM tenants WHERE id = 1;
-- المتوقع: صف واحد؛ وإلا أوقف.

-- 2) عدد المستأجرين (تأكيد single-tenant قبل backfill آمن)
SELECT COUNT(*) AS tenant_count FROM tenants;
-- إن > 1 راجع backfill يدوياً.

-- 3) الجداول المستهدفة موجودة
SELECT table_name FROM information_schema.tables
WHERE table_schema='public'
  AND table_name IN ('blood_bank_units','blood_bank_donors','blood_bank_crossmatch',
                     'blood_bank_transfusions','approvals','package_sessions')
ORDER BY table_name;

-- 4) مستخدم التطبيق ليس superuser ولا يتجاوز RLS
SELECT rolname, rolsuper, rolbypassrls FROM pg_roles WHERE rolname = 'nama_medical_app';
-- المتوقع: f / f.

-- 5) لقطة أعداد الصفوف قبل التطبيق
SELECT 'blood_bank_units' t, COUNT(*) c FROM blood_bank_units
UNION ALL SELECT 'approvals', COUNT(*) FROM approvals
UNION ALL SELECT 'package_sessions', COUNT(*) FROM package_sessions;
