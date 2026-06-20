# P1 — خطة اختبار ربط الترحيل (Posting Integration Test Plan)

> المرحلة: `P1_PATIENT_INVOICE_RECEIPT_POSTING_INTEGRATION_PLAN` — البوابة 5
> التاريخ: 2026-06-21 | **تصميم خطة فقط — لا تنفيذ اختبارات الآن.** تُنفَّذ محلياً/بروفة عند مرحلة الكود.

## 1. مصفوفة الاختبارات
| Test | المتوقّع |
| ---- | -------- |
| posting OFF: إنشاء فاتورة بلا قيد journal | PASS (journal غير متغيّر) |
| posting ON: إنشاء فاتورة ⇒ قيد متوازن | PASS (Σمدين=Σدائن) |
| فاتورة نقدية: Dr 1100 / Cr 4000 / Cr 2300 (VAT 15% شامل) | PASS |
| فاتورة تأمين: Dr 1110 بدل 1100 | PASS |
| سند قبض كامل يقلّل الذمم (Dr نقد/بنك، Cr 1100) | PASS |
| سند قبض **جزئي** يرحّل بمبلغ الدفعة (لا الإجمالي) مع مرجع idempotency فريد للدفعة | PASS |
| إلغاء/إشعار دائن ⇒ قيد عكسي متوازن | PASS |
| استرداد ⇒ Dr مردودات / Cr نقد/بنك | PASS |
| ترحيل مكرّر لنفس المستند محظور/idempotent (23505 → silent skip) | PASS |
| فشل الترحيل ⇒ rollback لحدث العمل (لا فاتورة جزئية ولا قيد يتيم) | PASS |
| خريطة حساب مفقودة ⇒ fail closed (MISSING_ACCOUNT_MAPPING + rollback) | PASS |
| `ACCOUNTING_POSTING_ENABLED` غائب ⇒ افتراضي OFF | PASS |
| عزل: المستأجر 1 لا يرى/لا يرحّل على قيود المستأجر 999 (حسابات per-tenant) | PASS |
| refund بعد إصلاح G3: لا يمكن استرداد فاتورة مستأجر آخر (404/403) | PASS |
| انحدار RLS P0 (tenant binding/cross_tenant_*) | PASS |
| انحدار استحقاق المنشأة (entitlement 41/0 + failclosed 50/0) | PASS |
| precondition: مخطط invoices يحوي كل الأعمدة التي يكتبها الكود قبل أي تفعيل | PASS (تحقّق مسبق) |

## 2. أنماط التنفيذ
- **وحدة المحرك**: `node accounting_posting_test.js` (28/28 موجود).
- **سيناريوهات DB**: على بروفة معزولة (نمط `nama_acct_rehearsal` المثبت 63/63) — تشمل OFF/ON، idempotency، fail-closed، عزل.
- **عزل ثابت**: ملفات `cross_tenant_*` (نمط static+simulation، exit 0).
- **انحدار**: تشغيل المجموعات قبل/بعد توصيل الكود؛ لا اعتبار فشل = نجاح.
- **القاعدة**: لا اختبار يكتب على الإنتاج؛ كله محلي/بروفة.

## 3. معيار اجتياز كل مرحلة rollout
كل صفوف المصفوفة ذات الصلة بتلك المرحلة = PASS + الانحدار أخضر، وإلا لا انتقال.

## 4. النتيجة
```text
GATE5_STATUS: TEST_PLAN_DEFINED
EXECUTION: deferred to code phase (local/rehearsal only)
NEXT: GATE6_PRODUCTION_READINESS
```

`PATIENT_INVOICE_RECEIPT_POSTING_TEST_PLAN_COMPLETE`
