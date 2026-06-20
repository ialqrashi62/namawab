# P1 — تصميم ربط الترحيل المحاسبي بالفواتير/السندات (Integration Design)

> المرحلة: `P1_PATIENT_INVOICE_RECEIPT_POSTING_INTEGRATION_PLAN` — البوابة 2
> التاريخ: 2026-06-21 | **تصميم فقط — لا تنفيذ كود.** المحرك يبقى OFF.

## 1. أين يُستدعى المحرك
عبر `accounting_posting_service.js` داخل كل مسار حدث مالي، باستخدام `runEventWithPosting(pool, ctx, doEvent, doPost)`. النمط (موجود فعلاً في 4 مسارات، ويُكمَّل للفجوتين):
```
runEventWithPosting(pool, pctx,
  doEvent: (client) => <يُنفّذ حدث العمل: INSERT/UPDATE الفاتورة> ويعيد صف الفاتورة,
  doPost:  (client, row) => postInvoiceIssued/postInvoicePayment/postInvoiceReversal/postRefund(...)
)
```

## 2. احترام `ACCOUNTING_POSTING_ENABLED`
- `isEnabled()` = `process.env.ACCOUNTING_POSTING_ENABLED === 'true'` (غير ذلك = OFF).
- داخل `runEventWithPosting`: `doPost` **لا يُستدعى إطلاقاً** إلا عند `isEnabled()`. لا حاجة لتعديل المسارات عند التبديل — العلم وحده يحكم.

## 3. السلوك عند OFF (الوضع الحالي والآمن)
- يُنفَّذ حدث العمل فقط (إنشاء/تحديث الفاتورة) ثم COMMIT.
- **لا** قيد journal، **لا** كسر للفواتير، لا تغيير سلوك مرئي للمستخدم.
- (تحسين اختياري عند الحاجة) تسجيل آمن "posting skipped (flag OFF)" بلا أسرار — غير مطلوب للسلامة.

## 4. السلوك عند ON (لاحقاً، بموافقة منفصلة)
- معاملة **واحدة** تضمّ حدث العمل + القيد (fail-closed): أي فشل في أيّهما ⇒ ROLLBACK كامل ⇒ لا فاتورة جزئية ولا قيد يتيم.
- **قيد متوازن** يُفرض بـ `validateBalanced` (Σ مدين = Σ دائن > 0) قبل الإدراج.
- **منع الترحيل المزدوج** عبر `uq_journal_idempotency(tenant_id, source_type, source_id)` + SAVEPOINT داخل `postEntry` ⇒ إعادة المحاولة تُعيد `{idempotent:true}` بهدوء دون كسر المعاملة.
- **ربط سياق المستأجر** (`set_config('app.tenant_id'…,true)`) داخل المعاملة (RLS-ready عند تفعيل سياسات finance مع دور غير-superuser).

## 5. ربط كل حدث (الحالة + المطلوب)
| الحدث | source_type | الغلاف | الحالة |
| ----- | ----------- | ------ | ------ |
| فاتورة نقدية | `invoice` | `postInvoiceIssued{insurance:false}` | ✅ موصول (724/738) |
| فاتورة تأمين | `invoice` | `postInvoiceIssued{insurance:true}` | ✅ موصول (regex payment_method) |
| سند قبض كامل | `receipt` | `postInvoicePayment` | ✅ موصول (1729) |
| سند قبض **جزئي** | `receipt` | `postInvoicePayment` بمبلغ الدفعة | ⛔ **مطلوب** (G2): توصيل `partial-pay` مع تمرير `amount=الدفعة` + مرجع idempotency فريد لكل دفعة (مثلاً `receipt:invId:seq`) لمنع تضارب القيد الفريد عند دفعات متعددة |
| إلغاء/إشعار دائن | `invoice_cancel` | `postInvoiceReversal` | ✅ موصول (5596) |
| استرداد | `refund` | `postRefund` | ✅ موصول (6472) — **بعد** إصلاح فلتر tenant (G3) |
| توليد فاتورة من بنود | `invoice` | `postInvoiceIssued` | ⛔ **مطلوب** (G1): لفّ `POST /api/invoices/generate` بنفس النمط |

> **ملاحظة idempotency للدفعات الجزئية**: المفتاح الحالي `(tenant_id, source_type='receipt', source_id=invoiceId)` يسمح بسند قبض **واحد** لكل فاتورة. الدفعات الجزئية المتعددة تحتاج `source_id` مركّباً/تسلسلياً (قرار تصميم يُحسم قبل توصيل G2 — يُسجَّل كبند).

## 6. الفواتير القديمة غير المرحَّلة
لا تُرحَّل تلقائياً عند التفعيل (التفعيل "للجديد فقط"). القرار التفصيلي في [P1_ACCOUNTING_LEGACY_INVOICE_BACKFILL_DECISION_AR.md](P1_ACCOUNTING_LEGACY_INVOICE_BACKFILL_DECISION_AR.md). idempotency يحمي من الترحيل المزدوج لو نُفِّذ backfill لاحقاً.

## 7. احترام العزل/الأمن/الاستحقاق/الخرائط/fail-closed
- **tenant**: `pctx` يُشتقّ من `getRequestTenantContext(req)`/الفاتورة الأصلية — لا يُقبل من العميل. `bindTenant` داخل المعاملة.
- **عزل/IDOR**: مسارات pay/cancel تتحقّق من ملكية الفاتورة؛ **refund يجب أن يضيف فحص الملكية (G3)** قبل التفعيل.
- **RLS**: ربط `app.tenant_id` جاهز؛ تفعيل RLS على جداول finance بند منفصل (خارج النطاق).
- **facility entitlement**: الحارس العام يطبّق على المسارات؛ المحاسبة "common module" غالباً — يُتحقَّق ضمن خطة الاختبار.
- **account mappings**: `resolveAccountId` يفشل مغلقاً (`MISSING_ACCOUNT_MAPPING`) ⇒ ROLLBACK.
- **fail-closed**: مضمون ببنية `runEventWithPosting` (معاملة واحدة).

## 8. النتيجة
```text
GATE2_STATUS: INTEGRATION_DESIGN_COMPLETE
DESIGN_ONLY: YES (no code)
COMPLETION_NEEDED: G1(generate) + G2(partial-pay, +idempotency key decision) + G3(refund tenant filter)
PRECONDITION: invoice schema drift reconciliation (controlled ALTER, separate approval)
NEXT: GATE3_FLAG_ROLLOUT_STRATEGY
```

`PATIENT_INVOICE_RECEIPT_POSTING_INTEGRATION_DESIGN_COMPLETE`
