# P1 — معايير جاهزية الإنتاج لربط الترحيل (Production Readiness Criteria)

> المرحلة: `P1_PATIENT_INVOICE_RECEIPT_POSTING_INTEGRATION_PLAN` — البوابة 6
> التاريخ: 2026-06-21 | **معايير فقط — لا تنفيذ/نشر.**

## 1. ما الذي سيتغيّر (في مرحلة الكود اللاحقة)
- `namaweb/server.js`: لفّ `POST /api/invoices/generate` (G1) و`PUT /api/invoices/:id/partial-pay` (G2) بـ `runEventWithPosting`؛ إضافة فلتر/فحص ملكية tenant في `refund` (G3).
- (تصميم idempotency للدفعة الجزئية: مرجع `source_id` مركّب للدفعات المتعددة.)
- لا تغيير على `accounting_posting.js`/`accounting_posting_service.js` (كافيان).

## 2. طبيعة التغيير
| سؤال | جواب |
| ---- | ---- |
| code-only؟ | **نعم** للتوصيل (G1/G2/G3). أمّا precondition انحراف مخطط `invoices` فيتطلّب **ALTER محكوم** (DDL منفصل بموافقة) |
| يحتاج deploy؟ | نعم (نشر كود namaweb) — مرحلة منفصلة |
| smoke checks؟ | نعم: إنشاء/دفع/إلغاء/استرداد فاتورة مع flag OFF تعمل كما قبل؛ ثم canary ON |
| rollback؟ | `ACCOUNTING_POSTING_ENABLED=false` (فوري، بلا فقد بيانات)؛ وكود التوصيل قابل للعودة عبر git |
| flag يبقى OFF بعد deploy؟ | **نعم** — ينشر الكود (OFF) ثم يُفعَّل تدريجياً بمرحلة لاحقة منفصلة |
| التفعيل في مرحلة منفصلة؟ | **نعم** (canary → new-only → full)، كلٌّ بموافقة |

## 3. معايير الاجتياز (Definition of Ready)
1. G1/G2/G3 منفّذة خلف flag OFF + مراجعة كود.
2. precondition مخطط `invoices` مُسوّى ومُتحقَّق (كل الأعمدة التي يكتبها الكود موجودة).
3. قرار مرجع idempotency للدفعة الجزئية محسوم ومختبَر.
4. خطة الاختبار (البوابة 5) كلها PASS على بروفة + الانحدار أخضر (RLS/entitlement).
5. خطة rollback موثّقة ومجرّبة (flag=false + تحقّق).
6. لا أسرار في المستودع؛ العلم عبر بيئة العملية فقط.
7. مراقبة بعد التفعيل: `unbalanced_posted_entries=0` + مطابقة إيراد/فواتير.

## 4. ما هو خارج جاهزية هذه الخطة (موافقات منفصلة)
- تنفيذ الكود (`P1_PATIENT_INVOICE_RECEIPT_POSTING_CODE_BEHIND_FLAG`).
- تسوية مخطط `invoices` (ALTER محكوم).
- تفعيل الـ flag (canary/new-only/full).
- backfill الفواتير القديمة.
- مطالبات التأمين (بُناة محرك جديدة).

## 5. النتيجة
```text
GATE6_STATUS: PRODUCTION_READINESS_CRITERIA_DEFINED
CHANGE_TYPE: code-only (wiring) + separate controlled ALTER (invoice schema precondition)
FLAG_AFTER_DEPLOY: OFF (gradual enable in separate approved phase)
NEXT: GATE7_CLOSEOUT
```

`PATIENT_INVOICE_RECEIPT_POSTING_PRODUCTION_READINESS_COMPLETE`
