# P1_DDL_AND_COA_SEED — تقرير تنفيذ الإنتاج

> المرحلة: `DDL_AND_COA_SEED_PRODUCTION_EXECUTION` (نطاق معتمد صراحةً). التاريخ: 2026-06-20.
> الهدف: `nama_medical_web` @ ::1:5432 (PostgreSQL 16.14).
> **تم تأسيس قاعدة المحاسبة في الإنتاج فقط.** لم يُوصَل المحرك بالفواتير · لا نشر تطبيق · لا قيود/فواتير إنتاج · لا استخدام `down.sql`.

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## ملخص البوابات
| Gate | الوصف | النتيجة |
|---|---|---|
| 0 | المستودع + الموافقة + git backup | ✅ HEAD=4780a2f، mapping بـ patch 10/10، backup/before-prod-ddl-exec |
| 1 | هوية الإنتاج + قفل أمان | ✅ nama_medical_web:5432، PG16.14، finance كلها 0 صف، لا أقفال، 0 جلسات أخرى |
| 2 | backup + تحقق | ✅ pg_dump custom (schema+data)، 531,108 بايت، pg_restore --list = 1249 كائناً |
| 3 | تطبيق DDL (up.sql) | ✅ BEGIN…COMMIT، EXIT=0 |
| 4 | CoA seed | ✅ 30 صفاً (25 ورقي + 5 رؤوس)، 0 مكرر، هرمية صحيحة، tenant=1، 0 رمز محرك مفقود |
| 5 | mapping seed | ✅ 23 صفاً، 10/10 رموز، بنك 1010 (3 صفوف)، 0 مرجع مكسور، 0 مكرر |
| 6 | validate.sql | ✅ **كل الفحوص 0 بما فيها missing_engine_account_codes=0** |
| 7 | تحقق سلامة ما بعد التنفيذ | ✅ المحرك غير موصول، journals=0/0، invoices لم تُمسّ، لا تغيير كود/نشر |
| 8 | سجل جاهزية الاسترجاع | ✅ موثّق (backup restore هو المسار) |

## حالة قاعدة المحاسبة في الإنتاج بعد التنفيذ
- `finance_journal_lines.debit/credit` = **numeric(18,2)** (كانت real).
- `finance_chart_of_accounts`: +tenant_id/facility_id/branch_id/is_postable/normal_balance + `uq_coa_tenant_code`؛ **30 حساباً** (25 قابل للترحيل + 5 رؤوس).
- `finance_journal_entries`: +source_type/source_id/posting_reference/status/posted_at/posted_by/reversed_entry_id/is_reversed + `uq_journal_idempotency` (جزئي) + index التاريخ.
- قيود: `fk_jl_entry`, `fk_jl_account`, `fk_je_reversed`, `chk_jl_nonneg`, `chk_jl_one_side`.
- فهارس: `idx_jl_entry`, `idx_jl_account`, `idx_jl_tenant`.
- `finance_posting_account_map`: جدول جديد، **23 صف ربط**، يغطّي 10/10 رموز المحرك.
- `finance_journal_entries`/`finance_journal_lines`: **0 صف** (لا قيود/فواتير — أساس نظيف).

## Gate 8 — جاهزية الاسترجاع (سجل)
- **مسار الاسترجاع المعتمد للإنتاج = استعادة من backup** المأخوذ في Gate 2:
  `pg_restore --clean --if-exists --no-owner --dbname="<PROD_DSN>" "C:/Users/ice/nama_prod_backups/nama_medical_web_pre_ddl_<ts>.dump"`
- **لماذا ليس `down.sql`؟** الـ down يخفض numeric→real (فقد دقة محتمل) وغير معتمد للإنتاج (قاعدة 14/15). الـ backup restore أدقّ وأأمن.
- شروط التوقف لأي مرحلة لاحقة: أي فشل في تطبيق/تحقق ⇒ توقف + تقييم استرجاع من backup؛ لا down أعمى.

## السلامة والامتثال للنطاق
| القاعدة | الحالة |
|---|---|
| backup قبل أي DDL | ✅ |
| تأكيد الهوية قبل التنفيذ | ✅ (حارس داخل نفس الأمر) |
| ملفات معتمدة فقط (up/coa/mapping/validate) | ✅ — `down.sql` لم يُستخدَم |
| لا توصيل محرك بالفواتير | ✅ (server.js بلا require؛ المرجع الوحيد ملف الاختبار) |
| لا نشر تطبيق | ✅ |
| لا قيود/فواتير إنتاج | ✅ (journals=0/0) |
| لا بيانات اصطناعية في الإنتاج | ✅ |
| لا تعديل `.gitmodules` / دمج `df893ab` | ✅ |
| لا force push | ✅ |
| لا جداول خارج النطاق تأثّرت | ✅ (فقط finance_* + جدول الربط الجديد) |

## الحالة
```text
FINAL_STATUS: DDL_AND_COA_SEED_PRODUCTION_EXECUTED_PASS
PRODUCTION_DB: nama_medical_web @5432 (PG 16.14)
BACKUP_TAKEN: YES (verified, 531108 bytes, outside git)
DDL_EXECUTED: YES | COA_SEEDED: 30 | MAPPING_SEEDED: 23 | VALIDATE: ALL_ZERO
JOURNAL_ROWS: 0 (no posting) | ENGINE_WIRED: NO | DEPLOYED: NO | FORCE_PUSH: NO
DOWN_SQL_USED: NO (rollback path = backup restore)
NEXT_REQUIRED_ACTION: SEPARATE_APPROVAL_FOR_INVOICE_POSTING_ENGINE_WIRING
```

## المرحلة التالية (تتطلب موافقة منفصلة)
توصيل `accounting_posting.js` بمسارات الفواتير/السندات (Reception/Invoices) لإنتاج قيود فعلية — **خارج نطاق هذه المرحلة** ويحتاج موافقة صريحة مستقلة.
