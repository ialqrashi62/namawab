# P1_DDL_AND_COA_SEED — تقرير بروفة Staging: **PASS**

> المرحلة: استئناف `DDL_AND_COA_SEED_STAGING_REHEARSAL`. التاريخ: 2026-06-20.
> هدف التنفيذ الوحيد: **staging على 127.0.0.1:5433 / nama_medical_staging_rehearsal**.
> **لم يُنفَّذ:** أي DDL/seed على الإنتاج (5432) · أي تغيير بيانات إنتاج · نشر · توصيل المحرك بالفواتير.

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
| 0 | المستودع + هوية staging + backup | ✅ PASS (`SAFE_STAGING_TARGET`، HEAD=eb4bca0، backup/before-staging-rehearsal-exec) |
| 1 | خط الأساس قبل DDL | ✅ PASS (8 جداول finance، 0 صف، money=real، CoA/cost_centers/fiscal_years بلا tenant_id، لا RLS/triggers، PK فقط) |
| 2 | مراجعة توافق SQL الثابتة | ✅ PASS (candidate إضافي بالكامل IF NOT EXISTS/DO/ON CONFLICT — متوافق مع 8 جداول قائمة؛ لا حاجة لتعديل في up) |
| 3 | تطبيق DDL | ✅ PASS (BEGIN…COMMIT، EXIT=0) |
| 4 | التحقق | ✅ PASS (money=NUMERIC(18,2)، coa.tenant_id مضاف، 8 أعمدة قيد، 3 FK، 2 CHECK، 6 فهارس؛ validate كله 0 عدا missing_engine_codes=10 قبل الـ seed) |
| 5 | بروفة CoA seed + idempotency | ✅ PASS (30 صفاً: 25 ورقي + 5 رؤوس، 5 أنواع، tenant_id=1، 0 مفقود، 0 مكرر؛ إعادة التشغيل = 30/0) |
| 6 | بروفة mapping seed + idempotency | ✅ PASS (بعد patch: 23 صفاً، **10/10 رموز محرك**، 0 مرجع مكسور، 0 مكرر؛ إعادة التشغيل = 23) |
| 7 | تحقق المحرك الجاف (بلا توصيل) | ✅ PASS (وحدات 28/28؛ توازن 115.00=115.00؛ دقة 33.335→33.34؛ idempotency/CHECK/FK كلها مرفوضة كالمصمَّم؛ ROLLBACK نظيف) |
| 8 | بروفة rollback + استعادة | ✅ PASS (down يزيل كائنات candidate فقط؛ الأساس سليم؛ استعادة up+reseed ناجحة) |

## أدلة مفتاحية
- **سلامة المال**: `finance_journal_lines.debit/credit` تحوّلت من `real` إلى `numeric(18,2)`؛ اختبار الدقة 33.335 → 33.34.
- **منع الترحيل المزدوج**: قيد فريد `uq_journal_idempotency(tenant_id,source_type,source_id)` رفض المستند المكرّر فعلياً.
- **سلامة مرجعية**: `fk_jl_account` رفض حساباً غير موجود؛ `chk_jl_one_side` رفض سطراً بمدين ودائن معاً.
- **عزل المستأجر**: CoA أصبحت وعية بالمستأجر (tenant_id + `uq_coa_tenant_code`)؛ كل البذور tenant_id=1.
- **idempotency للبذور**: CoA و mapping أعيد تشغيلهما بلا تكرار (ON CONFLICT DO NOTHING).
- **rollback**: `down.sql` أزال فقط ما أنشأه `up.sql` (لم يحذف بيانات ولا أعمدة سابقة مثل tenant_id على journal_entries).

## التعديل المُطبَّق (patch موثّق)
`account_mapping_seed_candidate.sql`: أُضيفت 3 صفوف بدائل بنك (`debit_bank/credit_bank → 1010`) لجعل رمز البنك صريحاً بدل ملاحظة نصية، فأصبحت التغطية 10/10 رموز محرك. تعديل **إضافي آمن** لا يُضعف العزل ولا يحذف قيوداً (مسموح ضمن Gate 2 / تسليم 7).

## حالة staging بعد البروفة (جاهزة للمرحلة التالية)
money=numeric · CoA=30 (5 رؤوس) · mapping=23 · journal_entries/lines=0 · 0 رموز محرك مفقودة. لا بيانات إنتاج. لا بيانات اصطناعية متبقية (ROLLBACK).

## RLS
لم تُفعَّل سياسات RLS على جداول finance في هذه البروفة — **خارج نطاق هذه المرحلة** (مسار P0 منفصل). الأعمدة tenant_id موجودة وتُهيّئ لتفعيل RLS لاحقاً.

## الحالة
```text
FINAL_STATUS: DDL_AND_COA_SEED_STAGING_REHEARSAL_PASS_PRODUCTION_PENDING_APPROVAL
TARGET: staging only (127.0.0.1:5433)
PRODUCTION_TOUCHED: NO | DATA_CHANGED(prod): NO | DEPLOYED: NO | ENGINE_WIRED: NO | FORCE_PUSH: NO
NEXT_REQUIRED_ACTION: PRODUCTION_EXECUTION_APPROVAL (see GO/NO-GO)
```
