# PHASE 6 — تكامل دور قارئ التدقيق (Audit-reader) — مرشّح فقط

> 2026-06-22 | لا GRANT، لا تفعيل. مراجعة الجاهزية فقط.

## الحالة الحيّة (postgres قراءة-فقط)
- الدور `nama_audit_reader` **موجود**: `rolcanlogin=false` (NOLOGIN)، `rolsuper=false`، `rolbypassrls=false` ✅.
- `nama_medical_app` **ليس عضواً** في `nama_audit_reader` ✅ (لا GRANT للتطبيق).
- ⇒ مطابق للتصميم: الدور جاهز، غير مُفعَّل.

## التصميم المطلوب قبل التفعيل (مرجع المرشّح السابق)
```text
SELECT-only على audit_trail (لا INSERT/UPDATE/DELETE)
WITH INHERIT FALSE (لا توريث صلاحيات للأعضاء تلقائياً)
SET ROLE محكوم خلف requireSuperAdmin فقط (قراءة super-admin عبر المستأجرين)
RESET ROLE في finally
pagination + حد أقصى للصفوف
إخراج آمن للتدقيق بلا تسريب PHI (تقييد الأعمدة)
```

## ما يلزم للتفعيل (موقوف بموافقة)
1. `GRANT SELECT ON audit_trail TO nama_audit_reader` + `GRANT nama_audit_reader TO nama_medical_app WITH INHERIT FALSE` (GRANT — يحتاج موافقة).
2. نشر مسار super-admin يفعّل `SET ROLE nama_audit_reader` بحدود.

## الحالة
```text
FINAL_STATUS: AUDIT_READER_RUNTIME_INTEGRATION_CANDIDATE_READY_NOT_DEPLOYED
ROLE: exists NOLOGIN/NOSUPER/NOBYPASSRLS   APP_IS_MEMBER: NO   GRANT_EXECUTED: NO
NEXT_REQUIRED_ACTION: APPROVE_AUDIT_READER_GRANT_AND_DEPLOY
```
