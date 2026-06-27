# P1 — استراتيجية تفعيل علم الترحيل المحاسبي (Flag Rollout Strategy)

> المرحلة: `P1_PATIENT_INVOICE_RECEIPT_POSTING_INTEGRATION_PLAN` — البوابة 3
> التاريخ: 2026-06-21 | **تصميم فقط — لا تفعيل.** كل مرحلة لاحقة تتطلّب موافقة منفصلة.

## 1. جدول المراحل
| Stage | `ACCOUNTING_POSTING_ENABLED` | النطاق | السلوك المتوقّع | الخطر |
| ----- | ---------------------------- | ------ | --------------- | ----- |
| 0. الحالي | **OFF** | الإنتاج | حدث العمل فقط، لا قيود (journal=0) | لا شيء |
| 1. إكمال الكود | OFF | تطوير | توصيل G1/G2 + إصلاح G3 + اختبارات؛ خلف flag OFF | منخفض (code-only، flag OFF) |
| 2. Shadow/dry-run (اختياري) | OFF + سجل تشخيصي | staging/dev | حساب القيد وتسجيله **دون إدراج** للتحقق من التوازن/الخرائط | منخفض (لا كتابة journal) |
| 3. Canary (مستأجر اختباري) | ON لمستأجر اختباري فقط | tenant اختباري | قيود متوازنة للأحداث الجديدة فقط | متوسط (محصور بمستأجر) |
| 4. تفعيل للجديد فقط | ON | الإنتاج | كل حدث جديد يُرحَّل؛ القديم يبقى unposted | متوسط (يُراقَب ميزان/توازن) |
| 5. Backfill القديم (اختياري) | ON | الإنتاج | ترحيل محكوم للفواتير القديمة بمرحلة منفصلة (idempotent) | متوسط-عالٍ (قرار منفصل) |
| 6. تفعيل كامل | ON | الإنتاج | الدورة كاملة بعد اجتياز كل الاختبارات والمراقبة | يُدار بالمراقبة + rollback |

## 2. ضوابط الانتقال بين المراحل
- لا انتقال إلا باجتياز خطة الاختبار (البوابة 5) لتلك المرحلة.
- آلية rollback فورية: `ACCOUNTING_POSTING_ENABLED=false` + إعادة تشغيل العملية ⇒ يعود السلوك إلى "حدث العمل فقط" بلا أثر على الأحداث اللاحقة (القيود المُرحَّلة تبقى، تُعالَج بقيود عكسية إن لزم لا بحذف).
- لكل مرحلة ON: مراقبة `unbalanced_posted_entries=0` + تطابق إجمالي الفواتير المُرحَّلة مع الإيراد.
- العلم يُضبط عبر بيئة العملية (PM2 env)، لا داخل المستودع (لا أسرار).

## 3. التبعية على precondition
لا يُدخل أي tenant مرحلة ON قبل تسوية انحراف مخطط `invoices` (G4) وإصلاح فلتر tenant في refund (G3)، وإلا تنكسر مسارات العمل أو يتسرّب عبر المستأجرين.

## 4. النتيجة
```text
GATE3_STATUS: ROLLOUT_STRATEGY_DEFINED
STAGES: OFF → code-complete(OFF) → shadow(opt) → canary → new-only(ON) → backfill(opt) → full(ON)
ROLLBACK: flag=false (instant, no data loss; corrections via reversal entries)
NEXT: GATE4_LEGACY_INVOICE_DECISION
```

`ACCOUNTING_POSTING_FLAG_ROLLOUT_STRATEGY_COMPLETE`
