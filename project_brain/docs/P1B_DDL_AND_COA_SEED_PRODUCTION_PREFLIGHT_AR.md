# P1B_DDL_AND_COA_SEED — Production Preflight (READ-ONLY)

> المرحلة: `PRODUCTION_PREFLIGHT_ONLY`. التاريخ: 2026-06-20.
> **فحص إنتاج للقراءة فقط.** لم يُنفَّذ أي DDL/seed/down على الإنتاج · لا كتابة · لا نشر · لا توصيل محرك.
> ضمان السلامة: كل اتصالات الإنتاج استخدمت `default_transaction_read_only=on` (اختبار ذاتي أثبت رفض الكتابة).

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## Gate 0 — المستودع: PASS
HEAD=`8b9a9ad` (متزامن 0/0)، تقارير البروفة + الملفات المرشّحة (مع patch البنك 10/10) موجودة. backup: `backup/before-p1b-prod-preflight`.

## Gate 1 — هوية الإنتاج: PASS (read-only)
| الحقل | القيمة |
|---|---|
| host_addr / port | ::1 / **5432** |
| database | **nama_medical_web** |
| user | postgres |
| server_version | PostgreSQL 16.14 |
| NODE_ENV (.env) | production |
| الجلسة | `default_transaction_read_only=on` (اختبار CREATE TEMP رُفض ✅) |
| uptime | ~1 يوم 7 ساعات |

## Gate 2 — أحجام وأعداد صفوف finance
| الجدول | الصفوف | الحجم الكلي |
|---|---|---|
| finance_chart_of_accounts | 0 | 16 kB |
| finance_journal_entries | 0 | 24 kB |
| finance_journal_lines | 0 | 16 kB |
| finance_vouchers | 0 | 16 kB |
| finance_cost_centers | 0 | 16 kB |
| finance_fiscal_years | 0 | 16 kB |
| finance_tax_declarations | 0 | 16 kB |
| finance_doctor_commissions | 0 | 16 kB |
| finance_posting_account_map | غير موجود (ينشئه الـ seed) | — |
حجم القاعدة الكلي: **16 MB**. **كل جداول finance فارغة.**

## Gate 3 — مخاطرة تحويل المال (real → numeric)
| فحص | نتيجة |
|---|---|
| نوع debit/credit الحالي | `real` |
| صفوف / غير فارغة | 0 / 0 |
| min/max | لا توجد بيانات |
| صفوف فقد دقة بعد numeric(18,2) | 0 |
| NaN / Infinity | 0 |
| قيم سالبة / null | 0 |
**التقييم: `REAL_TO_NUMERIC_SAFE`** — لا صفوف ⇒ التحويل فوري بلا إعادة كتابة بيانات وبلا أي فقد دقة ممكن.

## Gate 4 — جاهزية القيود/المفاتيح (هل ستمرّ على بيانات الإنتاج؟)
| فحص | نتيجة | الأثر |
|---|---|---|
| orphan_lines_no_entry | 0 | fk_jl_entry سيمرّ |
| lines_missing_account | 0 | fk_jl_account سيمرّ |
| both_sides_gt0 | 0 | chk_jl_one_side سيمرّ |
| null_tenant_entries / lines | 0 / 0 | لا مشكلة tenant |
| dup_account_codes | 0 | uq_coa_tenant_code سيمرّ |
| unbalanced_posted | 0 | لا قيود غير متوازنة |
**كل القيود المرشّحة ستمرّ نظيفة.** (idempotency على source_type/source_id غير قابل للتطبيق قبل الترحيل لأن العمودين يُضافان بالـ DDL.)

## Gate 5 — الأقفال والنشاط
| فحص | نتيجة |
|---|---|
| إجمالي الاتصالات / النشطة / idle-in-tx | 1 / 1 / 0 (الجلسة الحالية فقط) |
| أطول معاملة نشطة | لا توجد |
| أقفال على جداول finance | لا توجد |
| استعلامات محجوبة | 0 |
نافذة الصيانة متاحة دون تنازع؛ ومع جداول فارغة فإن مدة التنفيذ المتوقّعة ثوانٍ.

## Gate 6 — جاهزية النسخ الاحتياطي (أوامر فقط، لم يُنفَّذ backup)
| فحص | نتيجة |
|---|---|
| pg_dump | 16.14 = الخادم 16.14 (متوافق) |
| المساحة الحرة على C: | 689 GB (مستخدَم 28%) |
| حجم القاعدة | 16 MB (backup لحظي) |
| مجلّد الهدف | جاهز (خارج المستودع) |
أمر backup الموصى به (للتنفيذ عند الاعتماد فقط): `pg_dump --no-owner --format=custom -f <path>.dump "<PROD_DSN>"`؛ الاسترجاع: `pg_restore --clean --if-exists --no-owner --dbname="<PROD_DSN>" <path>.dump`.

## Gate 7 — تحديث runbook
حُدِّث [runbook الإنتاج](P1_DDL_AND_COA_SEED_PRODUCTION_RUNBOOK_AR.md) بقسم "نتائج P1B Preflight": مخاطرة منخفضة (جداول فارغة)، التحويل آمن وفوري، backup لحظي، لا تنازع أقفال.

## Gate 8 — القرار
كل البوابات نجحت؛ لا موانع؛ الجداول فارغة فالخطر منخفض جداً والتحذير السابق (قفل/فقد دقة) منتفٍ عملياً.

```text
FINAL_STATUS: PRODUCTION_PREFLIGHT_GO_PENDING_EXPLICIT_EXECUTION_APPROVAL
REAL_TO_NUMERIC: SAFE (0 rows)
CONSTRAINTS_FK: WILL_PASS (0 violations)
LOCK_RISK: LOW (empty tables, no contention)
BACKUP: READY (pg_dump 16.14 match, 16MB, 689GB free)
PRODUCTION_TOUCHED: NO (read-only) | DATA_CHANGED: NO | DEPLOYED: NO | ENGINE_WIRED: NO | FORCE_PUSH: NO
NEXT_REQUIRED_ACTION: DDL_AND_COA_SEED_PRODUCTION_EXECUTION (requires explicit approval + backup-first + post-validate)
```

## شروط التنفيذ الإلزامية عند الاعتماد لاحقاً
1. **backup أولاً** (16MB، لحظي) + تأكيد سلامته — مسار الاسترجاع المعتمد (لا down الأعمى).
2. تأكيد هوية الهدف (`current_database()=nama_medical_web`, port=5432) قبل أي أمر.
3. تطبيق up → CoA seed → mapping seed → `validate.sql` (كله 0، missing_engine_codes=0 بعد seed).
4. لا توصيل محرك، لا نشر تطبيق، لا force push.
