# P1 — قرار الفواتير القديمة (Legacy Invoice Backfill Decision)

> المرحلة: `P1_PATIENT_INVOICE_RECEIPT_POSTING_INTEGRATION_PLAN` — البوابة 4
> التاريخ: 2026-06-21 | **قرار تصميمي فقط — لا ترحيل، لا تنفيذ.**

## 1. الوضع الحالي
- `invoices` = **3 فواتير** (منها 2 مدفوعة، 0 استرداد)، و`finance_journal_entries = 0` ⇒ لا قيود تاريخية.
- المحرك OFF ⇒ لم تُرحَّل أي فاتورة بعد.

## 2. القرار
```text
LEGACY_INVOICES_DECISION: LEAVE_UNPOSTED_NOW + OPTIONAL_CONTROLLED_BACKFILL_LATER
```
- **الآن**: تُترك الفواتير القديمة **غير مرحَّلة** (`unposted`). التفعيل (عند الموافقة) **للأحداث الجديدة فقط**.
- **لاحقاً (اختياري، مرحلة منفصلة بموافقة)**: backfill محكوم للفواتير القديمة عبر سكربت يستخدم نفس أغلفة الخدمة (idempotent) ضمن معاملات.

## 3. منع الترحيل المزدوج
- `uq_journal_idempotency(tenant_id, source_type, source_id)` يضمن أن أي فاتورة (sourceId) تُرحَّل **مرة واحدة** فقط — سواء عبر المسار الحيّ أو backfill لاحق. إعادة المحاولة تُرجِع `{idempotent:true}` بهدوء.

## 4. تمييز الجديد عن القديم
خيارات تصميمية (تُحسم قبل التفعيل):
1. **بالـ idempotency** (المعتمد ضمنياً): backfill يحاول ترحيل الكل؛ المُرحَّل مسبقاً يُتخطّى تلقائياً ⇒ لا حاجة لعلم تمييز صريح.
2. **عمود `posted` على invoices** (اختياري، يتطلّب ALTER منفصل): علم صريح يسهّل التقارير/الفلترة، لكنه ليس شرطاً للسلامة (idempotency يكفي).
- التوصية: الاعتماد على idempotency للسلامة، وإضافة عمود `posted` لاحقاً فقط لأغراض العرض/المراقبة (قرار منفصل، خارج هذه الخطة).

## 5. ضوابط أي backfill مستقبلي
- بيئة بروفة أولاً (نمط البروفة المعزولة المثبت 63/63).
- معاملات لكل فاتورة + توقّف عند أول خطأ غير-idempotent.
- مطابقة: عدد القيود = عدد الفواتير القابلة للترحيل؛ `unbalanced_posted_entries=0`.
- لا حذف/تعديل لأي قيد قائم؛ التصحيح بقيود عكسية فقط.

## 6. النتيجة
```text
GATE4_STATUS: LEGACY_DECISION_DEFINED
DECISION: LEAVE_UNPOSTED_NOW ; CONTROLLED_BACKFILL = SEPARATE_APPROVED_PHASE
DOUBLE_POSTING_GUARD: uq_journal_idempotency
NEXT: GATE5_TEST_PLAN
```

`ACCOUNTING_LEGACY_INVOICE_BACKFILL_DECISION_COMPLETE`
