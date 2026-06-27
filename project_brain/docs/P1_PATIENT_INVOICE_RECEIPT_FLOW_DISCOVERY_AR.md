# P1 — اكتشاف مسارات الفواتير/السندات (Invoice/Receipt Flow Discovery)

> المرحلة: `P1_PATIENT_INVOICE_RECEIPT_POSTING_INTEGRATION_PLAN` — البوابة 1
> التاريخ: 2026-06-21 | فحص كود **قراءة فقط** (`server.js` / `accounting_posting_service.js`). لا تعديل.

## 1. جدول المسارات
| Flow | Route / السطر | السلوك الحالي | يحتاج ترحيل؟ | الخطر | ملاحظات |
| ---- | ------------- | ------------- | ----------- | ----- | ------- |
| إنشاء فاتورة (نقدي/تأمين) | `POST /api/invoices` — 724/738 | `runEventWithPosting` + `postInvoiceIssued` (نقدي/تأمين عبر regex على payment_method) | نعم | منخفض | **موصول**؛ doPost موجود |
| توليد فاتورة من بنود | `POST /api/invoices/generate` — 1709 | `pool.query` INSERT مباشر، **بلا** posting | نعم | **متوسط** | **فجوة**: مسار إنشاء ثانٍ لا يرحّل |
| دفع كامل | `PUT /api/invoices/:id/pay` — 1729 | `runEventWithPosting` + `postInvoicePayment` (نقد/بنك عبر regex) | نعم | منخفض | **موصول**؛ فحص ملكية tenant موجود |
| دفع جزئي | `PUT /api/invoices/:id/partial-pay` — 6444 | `pool.query` UPDATE مباشر (amount_paid/balance_due)، **بلا** posting | نعم | **متوسط** | **فجوة**: سند قبض جزئي لا يُرحَّل؛ يحتاج قرار مبلغ (الجزء لا الإجمالي) |
| إلغاء/إشعار دائن | `POST /api/invoices/cancel/:id` — 5596 | `runEventWithPosting` + `postInvoiceReversal` | نعم | منخفض | **موصول**؛ فحص ملكية tenant موجود |
| استرداد | `POST /api/invoices/:id/refund` — 6472 | `runEventWithPosting` + `postRefund` | نعم | **متوسط** | **موصول**، لكن `SELECT … WHERE id=$1` **بلا فلتر tenant** ⇒ خطر IDOR عبر المستأجرين |
| عرض الفواتير | `GET /api/invoices` — 711 | استعلام مفلتر tenant_id | لا | منخفض | قراءة فقط |
| حساب المريض | `GET /api/patients/:id/account` — 1756 | تجميع قراءة فقط | لا | منخفض | — |
| مطالبات التأمين | `/api/insurance/claims*` — 767+ | تسجيل/تحديث مطالبات | (مستقبلاً) | — | المحرك لا يملك بُناة approval/rejection بعد (فجوة محرك موثّقة) |

## 2. نقطة الربط المعتمدة مع `accounting_posting.js`
عبر طبقة `accounting_posting_service.js`:
- `runEventWithPosting(pool, ctx, doEvent, doPost)` — يفتح معاملة، يربط `app.tenant_id`/`app.facility_id` (`bindTenant`)، ينفّذ حدث العمل، ثم — **فقط عند `isEnabled()`** — يستدعي `doPost`، ثم COMMIT؛ أي فشل ⇒ ROLLBACK كامل.
- أغلفة جاهزة: `postInvoiceIssued`, `postInvoicePayment`, `postInvoiceReversal`, `postRefund` — تستدعي بُناة المحرك (`buildPatientInvoicePosting`/`buildReceiptPosting`/`buildReversalLines`/`buildRefundPosting`) ثم `postEntry`.
- `postEntry`: يتحقّق التوازن (`validateBalanced`)، يحلّ الحسابات بـ `(tenant_id, account_code, is_postable, is_active)` (fail-fast)، ويُدرج رأس القيد داخل **SAVEPOINT** فيُرجع `{idempotent:true}` بهدوء عند `23505` (ترحيل مكرّر) دون إجهاض معاملة العمل.

## 3. الفجوات المرصودة (تُعالَج في تصميم الربط)
1. **G1** — `POST /api/invoices/generate` (1709): إنشاء فاتورة بلا ترحيل. (مسار إنشاء ثانٍ.)
2. **G2** — `PUT /api/invoices/:id/partial-pay` (6444): سند قبض جزئي بلا ترحيل؛ يحتاج ترحيل بمبلغ الدفعة الجزئية لا الإجمالي.
3. **G3 (أمن/عزل)** — `POST /api/invoices/:id/refund` (6472): `SELECT` الفاتورة بلا فلتر `tenant_id` ⇒ احتمال استرداد فاتورة مستأجر آخر (IDOR). يجب إضافة فحص ملكية قبل أي تفعيل.
4. **G4 (precondition)** — انحراف مخطط `invoices` (أعمدة يكتبها الكود وغير موجودة في القاعدة) — يكسر مسارات الإنشاء/الإلغاء/الجزئي بصرف النظر عن الـ flag حتى تُسوَّى.
5. **G5 (محرك)** — مطالبات التأمين (اعتماد/رفض) بلا بُناة في المحرك — خارج نطاق فواتير/سندات هذه الخطة.

## 4. النتيجة
```text
GATE1_STATUS: FLOW_DISCOVERY_COMPLETE
WIRED_ROUTES: 4 (create, pay-full, cancel, refund)
GAP_ROUTES: 2 (generate, partial-pay) + 1 isolation gap (refund SELECT) + schema-drift precondition
NEXT: GATE2_INTEGRATION_DESIGN
```

`PATIENT_INVOICE_RECEIPT_FLOW_DISCOVERY_COMPLETE`
