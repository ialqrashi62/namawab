# P1_DDL_AND_COA_SEED — تقييم الإنتاج Go / No-Go

> **تقييم فقط — لا تنفيذ إنتاج.** يُكمّل [runbook الإنتاج](P1_DDL_AND_COA_SEED_PRODUCTION_RUNBOOK_AR.md) بقرار مُرجّح بالمخاطر بعد نجاح بروفة staging.
> التنفيذ يتطلب موافقة صريحة منفصلة.

## مبني على بروفة staging الناجحة
كل بوابات البروفة على 5433 نجحت (DDL/validate/CoA/mapping/engine/rollback). التفاصيل في [تقرير البروفة PASS](P1_DDL_AND_COA_SEED_STAGING_REHEARSAL_PASS_AR.md).

## فرق جوهري بين staging والإنتاج
- بروفة staging جرت على جداول finance **بـ 0 صف** ⇒ `ALTER COLUMN TYPE` و`ADD FK`/`ADD CHECK` كانت لحظية.
- **الإنتاج: عدد صفوف finance غير معروف** (التُقط schema-only فقط). إن كانت `finance_journal_lines` تحوي صفوفاً كثيرة، فإن إعادة كتابة الجدول والتحقق من القيود سيستغرقان وقتاً تحت قفل.

## الجداول المتأثرة (Blast Radius)
| الجدول | التغيير | مخاطرة الإنتاج |
|---|---|---|
| finance_journal_lines | ALTER TYPE NUMERIC + 2 CHECK + 2 FK + 3 indexes | **عالية** (إعادة كتابة + ACCESS EXCLUSIVE حسب حجم الصفوف) |
| finance_journal_entries | +8 أعمدة + UNIQUE idempotency جزئي + FK + index | متوسطة |
| finance_chart_of_accounts | +5 أعمدة + UNIQUE(tenant_id,account_code) + 30 صف seed | متوسطة |
| finance_posting_account_map | جدول جديد + 23 صف seed | منخفضة |
الجداول الأخرى (مرضى/فواتير/تأمين/RLS/entitlement): **لا تُمسّ**.

## سجل المخاطر المُرجّح
| المخاطرة | الشدّة | التخفيف | بوابة توقف |
|---|---|---|---|
| تحويل real→numeric تحت قفل | عالية | قياس عدد الصفوف في preflight؛ نافذة صيانة؛ backup أولاً | إن كان الحجم كبيراً جداً → خطة batched/منفصلة |
| التحقق من FK على بيانات قائمة | متوسطة | تشغيل `validate.sql` (orphan_lines/lines_missing_account) قبل up؛ أي > 0 = توقف | نعم |
| قيود غير متوازنة قائمة | متوسطة | `unbalanced_posted_entries` في validate يجب = 0 | نعم |
| null tenant على صفوف finance قائمة | متوسطة | `null_tenant_*` يجب = 0 (الإنتاج عُبّئ سابقاً tenant_id=1 على entries/lines؛ CoA جديدة) | نعم |
| تعارض رموز CoA قائمة | متوسطة | `dup_account_codes` = 0؛ ON CONFLICT يحمي الـ seed | نعم |
| تراجع RLS/entitlement | حرجة | DDL لا تلمس RLS/سياسات/جداول العزل؛ تحقق بعد التطبيق | نعم |
| rollback مفقود الدقة | متوسطة | `down.sql` يعيد real (lossy على بيانات حقيقية) ⇒ **backup restore هو مسار الاسترجاع المعتمد للإنتاج**، لا الـ down الأعمى | — |
| الإنتاج لا ينشئ الجداول تلقائياً | منخفضة (مُبطَلة) | تأكّدنا أن الإنتاج يحوي الجداول الثمانية فعلاً | — |

## أوامر preflight للإنتاج (read-only، قبل القرار)
```sql
-- عدد صفوف الجداول المتأثرة (يحدّد مدة القفل)
SELECT 'journal_lines', count(*) FROM finance_journal_lines
UNION ALL SELECT 'journal_entries', count(*) FROM finance_journal_entries
UNION ALL SELECT 'chart_of_accounts', count(*) FROM finance_chart_of_accounts;
-- ثم accounting_ddl_candidate_validate.sql كامل (كل bad_rows = 0)
```

## نافذة الصيانة الموصى بها
- جدولة في أقل أوقات الحِمل؛ إيقاف الكتابة المالية أثناء النافذة.
- مدة تقديرية = دالة في عدد صفوف `finance_journal_lines` (قِسها على نسخة بحجم الإنتاج قبل القرار).

## قائمة Go / No-Go
- [ ] backup إنتاج حديث + تحقق سلامته.
- [ ] preflight: عدّ الصفوف + `validate.sql` كله 0.
- [ ] نافذة صيانة معلَنة.
- [ ] تأكيد هوية القاعدة الهدف (`current_database()`, port) = الإنتاج المقصود.
- [ ] موافقة صريحة `DDL_AND_COA_SEED_APPROVAL`.
- [ ] خطة استرجاع = backup restore (وليس down الأعمى) جاهزة.
- [ ] تأكيد أن المحرك يبقى غير موصول وأن لا نشر تطبيق.

## القرار الحالي
```text
RECOMMENDATION: GO — مشروط بـ (backup + preflight نظيف + نافذة صيانة + موافقة صريحة)
RISK_LEVEL: MEDIUM (مرتفع فقط إن كان حجم finance_journal_lines كبيراً في الإنتاج)
PRODUCTION_EXECUTED: NO
NEXT_REQUIRED_ACTION: DDL_AND_COA_SEED_PRODUCTION_APPROVAL
```
