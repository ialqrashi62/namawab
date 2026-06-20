# P1 — Gate 1: تحليل فجوات DDL المحاسبي (DDL Gap Analysis)

> readiness فقط — لا تنفيذ. يحلّل المخطط الحالي مقابل متطلبات محرك الترحيل المحاسبي الطبي.

## ملخص الأسئلة الحاكمة

| السؤال | الإجابة (الحالي) |
|---|---|
| tenant_id في الجداول المحاسبية؟ | جزئي — موجود على entries/lines/vouchers، **مفقود على chart_of_accounts / fiscal_years / cost_centers** |
| debit/credit يستخدمان NUMERIC؟ | ❌ كلاهما `REAL` (عائم) |
| FK من journal lines → chart of accounts؟ | ❌ لا |
| FK من journal lines → journal entries؟ | ❌ لا |
| unique tenant-aware على account_code؟ | ❌ لا |
| idempotency / document posting protection؟ | ❌ لا (المحرك يبني مرجعاً نصياً فقط، بلا قيد DB) |
| reversal linkage؟ | ❌ لا عمود يربط القيد العكسي بالأصل |
| posted_at / posted_by؟ | ❌ لا (يوجد is_posted + created_by فقط) |
| قيود تمنع القيود غير المتوازنة؟ | ❌ لا على مستوى DB (المحرك فقط `validateBalanced`) |
| الجداول جاهزة لـ RLS لاحقاً؟ | جزئي — entries/lines لديها tenant_id؛ CoA لا؛ **لا توجد سياسات RLS على أي جدول finance** |
| status workflow للقيود؟ | ❌ لا (is_posted عدد صحيح فقط) |

## جدول الفجوات التفصيلي

| Table | Current State | Gap | Risk | Required DDL | Needs Migration? |
|---|---|---|---|---|---|
| finance_chart_of_accounts | بلا tenant_id، account_code TEXT بلا UNIQUE، بلا is_postable/normal_balance | لا عزل مستأجر، رموز قابلة للتكرار، لا تمييز حساب ورقي | ترحيل لحساب خاطئ/مكرر، تسريب بين مستأجرين | ADD tenant_id/facility_id/branch_id/is_postable/normal_balance + UNIQUE(tenant_id,account_code) | نعم |
| finance_journal_entries | tenant_id موجود، بلا source_type/source_id/posting_reference/status/posted_at/posted_by/reversed_entry_id | لا idempotency، لا حالة، لا أثر ترحيل، لا ربط عكسي | ترحيل مزدوج، تعديل صامت، لا تتبّع | ADD الأعمدة + UNIQUE(tenant,source_type,source_id) جزئي + FK reversed_entry_id | نعم |
| finance_journal_lines | debit/credit REAL، بلا FK، بلا CHECK، tenant_id موجود بلا index | أخطاء تقريب مالية، أسطر يتيمة، قيم سالبة/مزدوجة الجانب | قوائم مالية خاطئة، فساد مرجعي | ALTER TYPE NUMERIC(18,2) + FK(entry_id,account_id) + CHECK + indexes | نعم |
| finance_fiscal_years | بلا tenant_id | لا عزل سنوات مالية لكل مستأجر | خلط فترات | ADD tenant_id (لاحق) | نعم (أولوية أدنى) |
| finance_cost_centers | بلا tenant_id | لا عزل مراكز تكلفة | خلط مراكز | ADD tenant_id (لاحق) | نعم (أولوية أدنى) |
| finance_vouchers | amount REAL، tenant_id موجود | سلامة مال | تقارير سندات خاطئة | ALTER TYPE NUMERIC(18,2) (لاحق) | نعم (أولوية متوسطة) |

## قرار توازن القيد (Balance Enforcement)
- **CHOICE A (المعتمد):** تحقق على مستوى التطبيق — المحرك `validateBalanced` يرفض غير المتوازن/الصفري (مثبت 28/28). يُكمَّل بـ `chk_jl_nonneg` و`chk_jl_one_side` على مستوى السطر.
- **CHOICE B (دفاع في العمق، اختياري):** CONSTRAINT TRIGGER مؤجَّل يتحقق Σمدين=Σدائن عند `status='posted'` (مُعطّل افتراضياً في ملف الـ up؛ يُفعَّل بقرار صريح).
- السبب: trigger التوازن على مستوى DB معقّد مع الإدراج متعدد الأسطر داخل معاملة واحدة (يتطلب DEFERRED)، وقد يضرّ الأداء؛ لذا الأساس تطبيقي + قيود CHECK خفيفة، والـ trigger خيار لاحق.

## فجوة tenant على CoA — قرار التصميم
شجرة الحسابات ستصبح **وعية بالمستأجر** (ADD tenant_id + UNIQUE(tenant_id,account_code)) لتطابق قيود اليومية. أثره على المحرك: بحث الحساب يصبح `WHERE tenant_id=$t AND account_code=$c` (تعديل توصيل لاحق، خارج هذه المرحلة).

## فجوات المحرك (عمليات غير مغطّاة ببناة القيود بعد)
`insurance_claim_approval`, `insurance_claim_rejection`, `pharmacy_dispensing`, `grn_accrual`, `purchase_return`, `stock_adjustment` — تحتاج دوال build* جديدة لاحقاً (موثّقة في Gate 4).

## المخرج التالي
Gate 2: `accounting_ddl_candidate_up.sql` / `_down.sql` / `_validate.sql` + تقرير التصميم.
