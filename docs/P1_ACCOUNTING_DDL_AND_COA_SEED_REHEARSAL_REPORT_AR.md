# P1 — تقرير بروفة DDL وشجرة الحسابات المحاسبية (Rehearsal Report)

> المرحلة: `P1_ACCOUNTING_DDL_AND_COA_SEED_REHEARSAL` — البوابة 7 (قرار جاهزية الإنتاج)
> التاريخ: 2026-06-21 | بيئة: بروفة معزولة محلية | **لا لمس للإنتاج**.

## 0. ملخص تنفيذي
أُجريت بروفة كاملة لمرشّحات المحاسبة الثلاثة على قاعدة **منفصلة قابلة للحذف** (`nama_acct_rehearsal`) بُنيت من **أساس مطابق لِما قبل الترقية** (CoA بلا `tenant_id`، `debit/credit = REAL`)، ثم طُبِّقت المرشّحات فوقه واختُبرت: DDL → validate → seed → سيناريوهات المحرك الحقيقي → rollback → re-apply. **النتيجة: 35 فحص بروفة + 28 تأكيد وحدة للمحرك = 63/63 ناجح، 0 فشل.** قاعدة التطبيق `nama_medical_web` **لم تتغيّر** (لقطة قراءة قبل/بعد متطابقة 30/0/0). الإنتاج البعيد لم يُلمَس.

## 1. منهج البروفة (لماذا قاعدة منفصلة)
- مرشّحات DDL **تعديلية (ALTER)** تفترض وجود جداول `finance_*` الأساسية. لذلك بُني الأساس المطابق للإنتاج أولاً (من تعريفات `namaweb/db_postgres.js`: CoA الأساسي 8 أعمدة بلا `tenant_id`؛ entries/lines مع `tenant_id/facility_id/branch_id` كما يضيفها bootstrap؛ `debit/credit REAL`)، ثم طُبِّقت المرشّحات فوقه — وهو ما تواجهه الترقية فعلياً على الإنتاج.
- حارس صلب في أداة البروفة يرفض أي هدف يساوي `nama_medical_web`.
- أداة البروفة مؤقتة خارج المستودع (`.rehearsal_tmp/`) وحُذفت بالكامل بعد الانتهاء — **لا أثر في git، لا تعديل على namaweb**.

## 2. نتائج البوابات
### البوابة 3 — DDL up + validate (7/7)
- إضافة أعمدة CoA الواعية بالمستأجر (`tenant_id/facility_id/branch_id/is_postable/normal_balance`) ✅
- إضافة أعمدة الترحيل لـ entries (`source_type/source_id/posting_reference/status/reversed_entry_id/is_reversed`) ✅
- **نوع النقود → NUMERIC(18,2)** لـ debit و credit ✅
- الفهارس الستة (`uq_coa_tenant_code, uq_journal_idempotency, idx_jl_entry/account/tenant, idx_journal_entry_date`) ✅
- القيود الخمسة (`chk_jl_nonneg, chk_jl_one_side, fk_jl_entry, fk_jl_account, fk_je_reversed`) ✅
- **idempotency للترقية**: إعادة تشغيل up لا تُنشئ أعمدة مكررة ولا تُخطئ (عدد أعمدة CoA ثابت 13) ✅
- `validate` بعد DDL وقبل seed: كل الفحوص = 0 ما عدا `missing_engine_account_codes = 10` (متوقّع، الـ seed لم يُطبّق بعد) ✅

### البوابة 4 — CoA + mapping seed (6/6)
- عدد CoA = **30**؛ خريطة `finance_posting_account_map` = **23** ✅
- لا رموز حسابات مكرّرة لكل مستأجر ✅
- رموز المحرك العشرة موجودة وكلها `is_postable=TRUE` (1000/1010/1100/1110/1200/2100/2300/4000/4090/5000) ✅
- **idempotency للـ seed** (`ON CONFLICT DO NOTHING`): إعادة التشغيل تُبقي 30/23 دون تكرار ✅
- `validate` بعد الـ seed: **كل الفحوص الثمانية = 0** ✅

### البوابة 5 — سيناريوهات المحرك الحقيقي (16/16)
استُخدم `accounting_posting.js` فعلياً لبناء القيود، ثم رُحِّلت إلى قاعدة البروفة عبر دالة fail-closed (تحقق التوازن + تحقق وجود الحساب قبل الإدراج، مع ربط `app.tenant_id`).

| السيناريو | المتوقع | النتيجة |
| --------- | ------- | ------- |
| فاتورة مريض نقدية (115) | متوازنة؛ Dr 1100=115، Cr 4000=100، Cr 2300=15 | ✅ d=c=115.00 |
| فاتورة تأمين (230) | Dr 1110=230 + متوازنة | ✅ |
| سند قبض (50) | Dr نقد / Cr ذمم متوازن | ✅ |
| استرداد (30) | Dr مردودات / Cr نقد (contra) | ✅ |
| فاتورة مورّد (115) | Cr ذمم موردين 115 + متوازنة | ✅ |
| استهلاك مخزون (40) | Dr تكلفة / Cr مخزون | ✅ |
| **ترحيل مكرّر** | محظور بـ `uq_journal_idempotency` | ✅ **23505 unique_violation** |
| قيد عكسي (reversal) | متوازن + تبديل الجوانب (الذمم تصبح دائنة) | ✅ |
| **عزل المستأجرين** | المستأجران يرحّلان نفس `source_id` باستقلال؛ لا تسرّب | ✅ (acc 1100 = id مختلف لكل مستأجر؛ استعلام tenant=2 يرى صفّه فقط) |
| **خريطة غير صالحة** | fail closed (لا قيد يُكتب) | ✅ |
| FK حساب غير موجود | يُرفض | ✅ **23503 fk_jl_account** |
| CHECK مدين+دائن معاً | يُرفض | ✅ **23514 chk_jl_one_side** |
| وحدات المحرك النقية (داخل العملية) | 6/6 | ✅ |
| `validate` بعد السيناريوهات | كل الفحوص = 0 | ✅ |

> ملاحظة منهجية: عزل صفوف المحاسبة هنا يتحقق عبر فلترة `tenant_id` + فهرس idempotency **لكل مستأجر**، وليس عبر RLS (تفعيل RLS على جداول finance بند منفصل خارج نطاق هذه المرحلة).

### البوابة 6 — rollback + re-apply (6/6)
- `down`: النوع يعود **REAL**، أعمدة الترحيل تُحذف، القيود الخمسة تُحذف، الفهارس الستة تُحذف، المخطط يبقى قابلاً للاستعلام (غير مكسور) ✅
- **re-apply**: إعادة تطبيق `up` بعد `down` تنجح وتعيد NUMERIC ✅
- **تنبيه اكتمال rollback** (موثّق، ليس فشلاً): `down.sql` يعكس DDL فقط — يُبقي عمداً: جدول `finance_posting_account_map`، صفوف الـ seed، وأعمدة `tenant_id/facility_id/branch_id` على CoA (معلّقة في الملف لأنها قد تُستخدم في مكان آخر). تراجع الـ seed = حذف بيانات منفصل يجب تنفيذه يدوياً عند الحاجة.

### البوابة 5/0 — اختبار وحدة المحرك المستقل
`node accounting_posting_test.js` → **28 PASS / 0 FAIL**.

### انحدار العزل والاستحقاق (لم يتغيّر أي مصدر في الشجرة)
- `cross_tenant_facility_entitlement_test`: **41/0** ✅
- `cross_tenant_facility_failclosed_test`: **50/0** ✅
- `cross_tenant_wave2_modules_test` (عزل/RLS ثابت): **38/0** ✅
- `cross_tenant_leak_test`: ✅ (استعلامات tenant_id مُعاملة بـ parameters)
- `staging_failclosed_test`: لم يُشغّل (يتطلب تطبيق staging حيّاً، exit 3) — غير متأثر بالبروفة.

## 3. ملاحظات مرصودة (للتنفيذ الإنتاجي لاحقاً)
1. **ترتيب `validate.sql`**: الفحوص المعتمدة على `finance_chart_of_accounts.tenant_id` (3/5-coa/8) صالحة **بعد** `up.sql` فقط (العمود يُنشأ بالترقية). يُنصح بتقسيمها إلى: pre-flight (1,2,4,6,7) قبل up، ثم البقية بعد up/seed — أو توثيق الترتيب في خطة التنفيذ.
2. **`ALTER COLUMN TYPE` يقفل الجدول** ويعيد كتابته → نافذة صيانة + قياس الحجم على الإنتاج (lock).
3. **`down` ناقص للـ seed**: لا يحذف بيانات الـ seed ولا جدول الخريطة → يلزم سكربت حذف بيانات منفصل عند الاسترجاع الكامل (أو الاستعادة من backup).
4. **`NUMERIC→REAL` في down مفقود الدقة** → يُفضّل الاستعادة من backup بدل خفض النوع.

## 4. ⚠️ اكتشاف حَوْكَمي (من البوابة 0)
مرشّحات DDL + CoA seed + mapping **مُطبَّقة بالفعل على قاعدة التطبيق المحلية `nama_medical_web`** (CoA=30، map=23، NUMERIC، كل القيود/الفهارس) — لم تُنفَّذ في هذه الجلسة وغير موثّقة في إغلاق READINESS. الأرجح: الجلسة الموازية (R17). **الإنتاج البعيد: حالته مجهولة من هذه البيئة ويجب التحقق منها مستقلاً قبل أي قرار تنفيذ.** هذه الجلسة لم تلمس المحلية ولا البعيدة.

## 5. الحقول المطلوبة
```text
FINAL_STATUS: REHEARSAL_PASS_PRODUCTION_APPROVAL_REQUIRED
REHEARSAL_DB_USED: nama_acct_rehearsal (isolated, created+dropped in-phase)
PRODUCTION_TOUCHED: NO
DDL_EXECUTED_ON_REHEARSAL: YES (up applied + re-applied; idempotent)
DDL_EXECUTED_ON_PRODUCTION: NO
SEED_EXECUTED_ON_REHEARSAL: YES (CoA=30, mapping=23; idempotent)
SEED_EXECUTED_ON_PRODUCTION: NO
VALIDATION_RESULT: PASS (post-DDL: only missing-engine=10 as expected; post-seed & post-scenarios: all 0)
ROLLBACK_REHEARSAL_RESULT: PASS (down reverts DDL→REAL/cols/constraints/indexes; re-apply restores NUMERIC) — caveat: seed rollback is separate
ACCOUNTING_ENGINE_TEST_RESULT: PASS (unit 28/0 ; DB scenarios incl. balance/idempotency/reversal/fail-closed/FK/CHECK 16/0)
TENANT_ISOLATION_RESULT: PASS (per-tenant CoA ids + per-tenant idempotency; no cross-tenant leakage in rehearsal)
RLS_REGRESSION_RESULT: NOT_AFFECTED (no source/schema change in tree; isolation suites green: wave2 38/0, leak PASS; live-DB/staging RLS suites not run — require infra)
FACILITY_ENTITLEMENT_REGRESSION_RESULT: PASS (entitlement 41/0, fail-closed 50/0)
BLOCKERS: NONE (4 watch-items documented for production execution, none blocking)
PRODUCTION_EXECUTION_RECOMMENDATION: APPROVE-WITH-CONDITIONS — backup first; maintenance window for ALTER TYPE rewrite; run validate pre-flight subset then post-DDL; verify remote-prod current state (may already be applied per §4); keep ACCOUNTING_POSTING_ENABLED=OFF until separate wiring phase
NEXT_REQUIRED_ACTION: ACCOUNTING_DDL_AND_COA_SEED_PRODUCTION_APPROVAL
```

`ACCOUNTING_DDL_AND_COA_SEED_REHEARSAL_COMPLETE`
