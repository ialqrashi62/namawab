# P2B — دليل تبديل دور التطبيق وإنفاذ RLS في الإنتاج (Runbook)

> **تخطيط فقط — لا تنفيذ.** كل خطوة تكتب على الإنتاج تتطلب موافقة صريحة منفصلة.
> مبني على بروفة staging الناجحة — [التقرير](P2B_APP_DB_ROLE_RLS_ENFORCEMENT_REPORT_AR.md).

## الهدف
تشغيل التطبيق بدور **غير-superuser/غير-BYPASSRLS** فتُنفَّذ سياسات RLS (الـ35 القائمة + 7 مالية) فعلياً، دون كسر التطبيق.

## المتطلبات المسبقة (قبل أي تبديل إنتاج)
- [x] **smoke للتطبيق على staging تحت `nama_medical_app`** — **تم في P2C (13 PASS / 0 FAIL، 0 grant gaps)**؛ انظر docs/P2C_FULL_STAGING_APP_SMOKE_UNDER_RUNTIME_ROLE_REPORT_AR.md. (توصية: تشغيل الخادم الكامل end-to-end كذلك قبل التبديل النهائي.)
- [ ] قرار حول **تغطية RLS لـ79 جدول tenant_id غير مغطّى** (تطبيق سياسات أو قبول الاعتماد على فلترة التطبيق مؤقتاً).
- [ ] backup إنتاج حديث + تأكيد.
- [ ] نافذة صيانة.
- [ ] كلمة مرور الدور مُجهَّزة بقناة آمنة (secret manager) — ليست في git.

## الخطوات (عند الاعتماد فقط)
```bash
PGBIN="/c/Program Files/PostgreSQL/16/bin"
# 1) إنشاء الدور + المنح (كـ postgres/admin)
psql "$PROD_DSN_ADMIN" -v ON_ERROR_STOP=1 -f docs/accounting_candidates/app_runtime_role_candidate.sql
# 2) ضبط كلمة المرور بقناة آمنة (لا تلتزمها)
psql "$PROD_DSN_ADMIN" -c "ALTER ROLE nama_medical_app PASSWORD '<from-secret-manager>';"
# 3) تحقق خصائص الدور والمنح
psql "$PROD_DSN_ADMIN" -f docs/accounting_candidates/app_runtime_role_validate.sql   # super=f, bypassrls=f
# 4) (اختياري بموافقة) تطبيق finance RLS
psql "$PROD_DSN_ADMIN" -v ON_ERROR_STOP=1 -f docs/accounting_candidates/finance_rls_candidate_up.sql
# 5) تبديل اتصال التطبيق: DB_USER=nama_medical_app + كلمة المرور (عبر secret/env، ليس git)
# 6) إعادة تشغيل التطبيق
# 7) smoke إنتاج محكوم (قراءة + عملية اختبار محدودة) مع مراقبة أخطاء permission/0-rows
```

## التحقق بعد التبديل (read-only)
- التطبيق يعمل دون أخطاء `permission denied`.
- جداول tenant: المستخدم يرى مستأجره فقط (RLS تُنفَّذ الآن لأن الدور غير-superuser).
- لا مسار يُرجع 0 صفوف غير متوقّع (دليل على ضبط app.tenant_id في كل مسار).

## الاسترجاع (فوري، غير هدّام)
- **إعادة `DB_USER` إلى الدور السابق (postgres)** + إعادة تشغيل التطبيق ⇒ يعود السلوك فوراً (RLS تُتجاوز كما قبل). البيانات لا تُمسّ.
- تعطيل finance RLS عند الحاجة: `finance_rls_candidate_down.sql`.
- ملاحظات سحب الدور: `app_runtime_role_rollback_notes.sql` (لا تحذف الدور أثناء اتصاله).

## شروط التوقف
- أي `permission denied` متكرر ⇒ توقف، أعد DB_USER إلى postgres، أكمل المنح الناقصة على staging أولاً.
- أي مسار يُرجع 0 صفوف غير متوقّع بعد التبديل ⇒ مسار لا يضبط app.tenant_id ⇒ أصلحه قبل المتابعة.

## نافذة الصيانة
موصى بها (تبديل اعتماد + إعادة تشغيل + smoke). الأثر على البيانات: لا شيء (تبديل دور/منح + RLS تعريف فقط).

## الحالة
```text
ROLE_SQL: READY (staging-proven) | PROD_APPLIED: NO | DB_USER_SWITCHED: NO
PREREQUISITES: full-app staging smoke under role + 79-table RLS coverage decision + approval
ROLLBACK: revert DB_USER to postgres (instant)
```
