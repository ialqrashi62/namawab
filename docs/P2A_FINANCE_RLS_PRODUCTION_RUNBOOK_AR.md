# P2A — دليل تشغيل RLS المالية في الإنتاج (Runbook)

> **تخطيط فقط — لا تنفيذ.** يتطلب موافقة صريحة بعد أدلة staging.
> مبني على بروفة staging الناجحة (عزل مثبت بدور غير-superuser) — [التقرير](P2A_FINANCE_RLS_AND_FAIL_CLOSED_READINESS_REPORT_AR.md).

## الشرط المسبق الحاكم (Enforcement Prerequisite)
سياسات RLS **لا تُنفَّذ** على دور superuser/BYPASSRLS. التطبيق حالياً يتصل كـ `postgres` (superuser). لإنفاذ RLS المالية فعلياً:
1. إنشاء/اعتماد دور تطبيق **غير superuser وغير BYPASSRLS** (يوجد `test_rls_user` كمرجع؛ يُفضَّل دور مخصّص `nama_app`).
2. منحه `SELECT/INSERT/UPDATE/DELETE` على الجداول و`USAGE,SELECT` على السلاسل.
3. تحويل اتصال الإنتاج (`DB_USER`) إلى هذا الدور — **تغيير اعتماد يحتاج موافقة منفصلة**.
4. التأكد أن كل مسار مالي يضبط `app.tenant_id` قبل الاستعلامات (الغلاف `withTenantTransaction` + خدمة الترحيل المُصلّبة تفعل ذلك).
**بدون الخطوة 3 يبقى RLS المالي دفاعاً كامناً غير منفَّذ على اتصال التطبيق.**

## الملفات
- [finance_rls_candidate_up.sql](accounting_candidates/finance_rls_candidate_up.sql) — ENABLE+FORCE+سياسات لـ7 جداول.
- [finance_rls_candidate_down.sql](accounting_candidates/finance_rls_candidate_down.sql) — تعطيل + حذف السياسات.

## الجداول المتأثرة
chart_of_accounts، journal_entries، journal_lines، vouchers، tax_declarations، doctor_commissions، posting_account_map. (cost_centers، fiscal_years مؤجَّلة حتى تُضاف tenant_id.)

## نطاق الأثر والمخاطر
| البند | التقييم |
|---|---|
| إعادة كتابة بيانات | لا (RLS تعريف فقط) |
| قفل | ALTER ... ENABLE/FORCE RLS خفيف (قفل قصير) |
| مخاطرة على القراءات الحالية | منخفضة (التطبيق superuser ⇒ غير متأثّر حتى تغيير الدور) — لكن **هذا بالضبط لماذا يلزم تغيير الدور بحذر مع اختبار** |
| كسر مسار بلا app.tenant_id | متوسطة بعد تحويل الدور ⇒ يجب تدقيق كل مسار مالي يضبط السياق قبل go-live |

## الأوامر (عند الاعتماد فقط)
```bash
PGBIN="/c/Program Files/PostgreSQL/16/bin"
# 1) backup (P1 pattern) ثم تأكيد الهوية
psql "$PROD_DSN" -c "SELECT current_database(), inet_server_port();"
# 2) تطبيق RLS
psql "$PROD_DSN" -v ON_ERROR_STOP=1 -f docs/accounting_candidates/finance_rls_candidate_up.sql
# 3) تحقق
psql "$PROD_DSN" -c "SELECT count(*) FROM pg_policies WHERE tablename LIKE 'finance_%';"  -- =7
psql "$PROD_DSN" -c "SELECT count(*) FROM pg_class WHERE relname LIKE 'finance_%' AND relrowsecurity;"  -- =7
# 4) (منفصل/موافقة) تحويل اتصال التطبيق لدور غير-superuser + اختبار محكوم
```

## التحقق بعد التطبيق (بدور غير-superuser)
- بلا app.tenant_id ⇒ 0 صفوف. مع tenant=N ⇒ صفوف tenant N فقط. إدراج عبر-المستأجر مرفوض.

## الاسترجاع
- `finance_rls_candidate_down.sql` (تعطيل فوري للسياسات) — غير هدّام، لا يحذف بيانات.
- لا حاجة لـ backup restore (RLS تعريف فقط)، لكن backup قبل أي تغيير يبقى إلزامياً.

## شروط التوقف
- أي مسار مالي يعيد 0 صفوف غير متوقّع بعد تحويل الدور ⇒ تعطيل RLS (down) فوراً + إصلاح ضبط السياق.

## الحالة
```text
RLS_DDL: READY (staging-proven) | PROD_APPLIED: NO
PREREQUISITE: non-superuser app role (separate approval)
NEXT: APPROVE_RLS_PROD_APPLY + NON_SUPERUSER_ROLE_CUTOVER
```
