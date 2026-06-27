# P1 — مراجعة ملفات المرشّحات قبل البروفة (Candidate Files Review)

> المرحلة: `P1_ACCOUNTING_DDL_AND_COA_SEED_REHEARSAL` — البوابة 1
> التاريخ: 2026-06-21 | الحالة: `CANDIDATES_REVIEWED_OK` | مراجعة ثابتة قبل التنفيذ على البروفة فقط.

## 1. الملفات المعتمدة (المصدر الوحيد المسموح)
المسار: `docs/accounting_candidates/` — **لا تُستخدم أي نسخة من `docs/sql/`**.

| # | الملف | الحجم | الغرض |
| - | ----- | ----- | ----- |
| 1 | `accounting_ddl_candidate_up.sql` | 6382 B | ترقية المخطط (additive + idempotent) |
| 2 | `accounting_ddl_candidate_down.sql` | 3121 B | تراجع المخطط |
| 3 | `accounting_ddl_candidate_validate.sql` | 3269 B | تحقق (قراءة فقط) |
| 4 | `medical_coa_seed_candidate.sql` | 8230 B | شجرة حسابات أولية (large_hospital, tenant 1) |
| 5 | `account_mapping_seed_candidate.sql` | 3777 B | خريطة حسابات لكل عملية ترحيل |

> ملاحظة: مجلد `docs/accounting_candidates/` يحوي أيضاً ملفات RLS/role (group A/B/C/D، finance_rls، app_runtime_role) — **خارج نطاق هذه المرحلة تماماً** (ممنوع لمس RLS Waves)؛ لن تُنفَّذ.

## 2. مصفوفة التحقق من المعايير
| المعيار | النتيجة | الدليل |
| ------- | ------- | ------ |
| لا أسرار (مفاتيح/كلمات مرور/توكنات) | ✅ نظيف | لا قيم سرّية؛ SQL بحت + تعليقات عربية |
| لا SQL تدميري غير مبرّر | ✅ | up: `ADD COLUMN IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS` / إضافة قيود عبر `DO` حارس؛ لا `DROP TABLE`/`TRUNCATE`/`DELETE` |
| يحتوي rollback | ✅ | `accounting_ddl_candidate_down.sql` يعكس كل تغيير (قيود/فهارس/أعمدة/نوع) |
| يحتوي validation | ✅ | `accounting_ddl_candidate_validate.sql` (8 فحوص قراءة فقط) |
| دعم `tenant_id` | ✅ | يضيف `tenant_id/facility_id/branch_id` لـ CoA؛ فهرس فريد `(tenant_id, account_code)`؛ idempotency لكل `(tenant_id, source_type, source_id)`؛ `idx_jl_tenant` |
| نوع النقود NUMERIC | ✅ | `ALTER COLUMN debit/credit TYPE NUMERIC(18,2) USING ROUND(...,2)` (إصلاح خطر REAL) |
| idempotency / مرجع مستند | ✅ | `source_type/source_id/posting_reference` + فهرس فريد جزئي `uq_journal_idempotency` يمنع الترحيل المزدوج |
| FK / unique / indexes مطلوبة | ✅ | FK: `fk_jl_entry, fk_jl_account, fk_je_reversed`؛ CHECK: `chk_jl_nonneg, chk_jl_one_side`؛ فهارس: `idx_jl_entry/account/tenant, idx_journal_entry_date`؛ unique: `uq_coa_tenant_code, uq_journal_idempotency` |

## 3. تطابق المرشّحات مع المحرك (`accounting_posting.js`)
- رموز المحرك العشرة في `ACCOUNT_CODES` (1000/1010/1100/1110/1200/2100/2300/4000/4090/5000) **كلها** مزروعة كحسابات ورقية (`is_postable=TRUE`) في `medical_coa_seed_candidate.sql`. ✅
- `buildPostingReference('TYPE', id)` → `POST:TYPE:ID` يطابق عمود `posting_reference`؛ و`uq_journal_idempotency` على `(tenant_id, source_type, source_id)` يطابق منطق منع التكرار. ✅
- خريطة `finance_posting_account_map` (23 صفاً) تغطّي عمليات البناة الحالية، وتترك مكاناً للعمليات غير المغطاة بعد (claim approval/rejection، dispensing، GRN، purchase return، stock adjustment) — موثّق كفجوة محرك. ✅

## 4. ملاحظات/مخاطر تُرصد للبروفة (ليست موانع)
1. **ترتيب `validate.sql`**: الفحوص 3 و5(CoA) و8 تشير إلى `finance_chart_of_accounts.tenant_id` الذي **لا يُنشأ إلا بعد** `up.sql`. لذا رغم أن ترويسة الملف تقول «قبل up»، فإن الفحوص المعتمدة على `tenant_id` صالحة **بعد** `up` فقط. سيُختبر الترتيب الصحيح في البروفة ويُوثّق.
2. **خفض النوع في `down.sql`**: `NUMERIC → REAL` يفقد الدقة (موثّق داخل الملف، ويُفضّل الاسترجاع من backup). مقبول كـ rollback اضطراري.
3. **اكتمال الـ rollback**: `down.sql` يعكس DDL فقط؛ لا يحذف صفوف الـ seed ولا جدول `finance_posting_account_map` (تراجع الـ seed = حذف بيانات منفصل). سيُوثّق في تقرير البروفة.
4. **أداء**: `ALTER COLUMN TYPE` يعيد كتابة الجدول ويقفل — يتطلّب نافذة صيانة عند الإنتاج (موثّق في خطة التنفيذ).
5. **قسم اختياري (CHOICE B)**: محفّز توازن DB معطّل بالتعليق؛ الاعتماد الأساسي على تحقق التطبيق `validateBalanced` (CHOICE A). لن يُفعّل في البروفة.

## 5. النتيجة
```text
GATE1_STATUS: CANDIDATES_REVIEWED_OK
SECRETS: NONE
DESTRUCTIVE_SQL: NONE_UNJUSTIFIED
ROLLBACK_PRESENT: YES
VALIDATION_PRESENT: YES
TENANT_ID_SUPPORT: YES
NUMERIC_MONEY: YES
IDEMPOTENCY: YES (uq_journal_idempotency + posting_reference)
FK_UNIQUE_INDEXES: YES
WATCH_ITEMS: validate-order, numeric→real precision, seed-rollback-separate, alter-rewrite-lock
NEXT: GATE2_REHEARSAL_DB_SETUP
```

`ACCOUNTING_REHEARSAL_CANDIDATE_REVIEW_COMPLETE`
