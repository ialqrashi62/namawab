# P1 — Gate 2: تصميم DDL المرشّح (DDL Candidate Design)

> readiness فقط — **الملفات مرشّحة ولم تُنفَّذ**. الهدف: PostgreSQL (staging أولاً ثم إنتاج محكوم).

## الملفات المرشّحة (تحت `docs/accounting_candidates/`)
1. [accounting_ddl_candidate_validate.sql](accounting_candidates/accounting_ddl_candidate_validate.sql) — فحص preflight read-only (يُشغَّل أولاً).
2. [accounting_ddl_candidate_up.sql](accounting_candidates/accounting_ddl_candidate_up.sql) — الترقية.
3. [accounting_ddl_candidate_down.sql](accounting_candidates/accounting_ddl_candidate_down.sql) — التراجع.

## ما يفعله الـ up (ملخص)
| # | التغيير | الجدول | الغرض |
|---|---|---|---|
| 1 | ADD tenant_id/facility_id/branch_id/is_postable/normal_balance + `UNIQUE(tenant_id,account_code)` | chart_of_accounts | عزل مستأجر + منع تكرار الرمز + تمييز الحساب الورقي |
| 2 | ADD source_type/source_id/posting_reference/status/posted_at/posted_by/reversed_entry_id/is_reversed | journal_entries | idempotency + حالة + أثر ترحيل + ربط عكسي |
| 2b | `UNIQUE(tenant_id,source_type,source_id) WHERE ...` | journal_entries | **منع الترحيل المزدوج** لكل مستند لكل مستأجر |
| 3 | `ALTER debit/credit TYPE NUMERIC(18,2)` | journal_lines | سلامة المال (إزالة العائم) |
| 4 | CHECK(`chk_jl_nonneg`,`chk_jl_one_side`) + FK(`fk_jl_entry`,`fk_jl_account`,`fk_je_reversed`) | journal_lines/entries | سلامة مرجعية + رفض الأسطر الفاسدة |
| 5 | indexes (entry_id, account_id, tenant, entry_date) | journal_lines/entries | أداء الترحيل والتقارير |

## خصائص الأمان في التصميم
- **idempotent**: كل ADD COLUMN بـ `IF NOT EXISTS`؛ كل قيد داخل `DO $$` يفحص `pg_constraint`؛ الفهارس `IF NOT EXISTS`.
- **معاملاتي**: داخل `BEGIN; ... COMMIT;` — فشل أي خطوة يتراجع كاملاً.
- **preflight إلزامي**: `validate.sql` يكشف الأسطر اليتيمة/الحسابات المفقودة/الرموز المكررة/القيود غير المتوازنة/قيم null tenant **قبل** إضافة FK/CHECK (التي قد تفشل على بيانات قائمة).

## قرار فرض التوازن
- **CHOICE A معتمد**: تطبيق (`validateBalanced` في المحرك، 28/28) + `chk_jl_one_side`/`chk_jl_nonneg`.
- **CHOICE B اختياري**: `CONSTRAINT TRIGGER ... DEFERRABLE INITIALLY DEFERRED` (موجود معطّلاً في نهاية ملف up). يُفعَّل بقرار صريح فقط؛ سببه ودواعي تأجيله موثّقة في Gate 1.

## تحذيرات تنفيذ (تُعالَج في Gate 6)
- `ALTER COLUMN TYPE` يعيد كتابة الجدول ويأخذ قفلاً حصرياً ⇒ **نافذة صيانة** على journal_lines الكبيرة.
- إضافة FK تتحقق من البيانات القائمة ⇒ يجب أن يكون `validate.sql` نظيفاً أولاً.
- الإنتاج لا يُنشئ الجداول تلقائياً (`NODE_ENV=production`) ⇒ تأكيد وجود الجداول/الأعمدة قبل ALTER.

## الاسترجاع (down)
يحذف القيود/الفهارس/الأعمدة المضافة، ويعيد النوع إلى REAL (مفقود الدقة — يُفضَّل الاسترجاع من backup). أعمدة tenant على CoA تُترك معلّقة افتراضياً تحسّباً لاستخدامها في مكان آخر.

## المخرج التالي
Gate 3: تصميم CoA + `medical_coa_seed_candidate.sql`.
