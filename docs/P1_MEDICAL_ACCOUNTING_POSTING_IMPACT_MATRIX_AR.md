# P1 الترحيل المحاسبي — 03 مصفوفة الأثر المحاسبي (Impact Matrix)

> التاريخ: 2026-06-20 | القيود متوازنة (مدين=دائن). الضريبة 15% (الإجمالي شامل الضريبة).
> "Current" = الحالة على الإنتاج/الكود (كلها غير مرحَّلة حالياً).

| # | Process | Expected Accounting Entry | Current Implementation | Gap | Evidence | Priority |
| - | ------- | ------------------------- | ---------------------- | --- | -------- | -------- |
| 1 | فاتورة مريض نقدية | Dr ذمم مريض (الإجمالي) / Cr إيراد (الصافي) / Cr ضريبة | لا قيد (صف invoices فقط) | Missing posting | server.js POST /api/invoices | P1 |
| 2 | فاتورة مريض تأمين | Dr ذمم تأمين / Cr إيراد / Cr ضريبة | لا قيد | Missing posting | insurance/claims سجلات فقط | P1 |
| 3 | سند قبض | Dr نقد/بنك / Cr ذمم مريض | لا قيد | Missing posting | invoices/:id/pay | P1 |
| 4 | استرداد | Dr مردودات الإيراد / Cr نقد/بنك | لا قيد | Missing posting | invoices/:id/refund | P1 |
| 5 | إشعار دائن (إلغاء) | Dr مردودات + Dr ضريبة / Cr ذمم مريض | لا قيد | Missing posting + reversal | invoices/cancel/:id | P1 |
| 6 | موافقة مطالبة تأمين | Dr ذمم تأمين معتمدة / (تسوية) | لا قيد | Missing posting | insurance/claims | P2 |
| 7 | رفض مطالبة تأمين | Dr مصروف ديون معدومة/تسوية / Cr ذمم تأمين | لا قيد (لا تُحذف الإيراد بصمت — صحيح حالياً) | Missing posting | insurance/claims | P2 |
| 8 | صرف صيدلية مرتبط بفاتورة | (إيراد عبر الفاتورة) + Dr COGS / Cr مخزون | لا قيد | Missing posting | pharmacy/deduct-stock | P1 |
| 9 | استهلاك مخزون | Dr تكلفة/مستلزمات / Cr مخزون | لا قيد | Missing posting | inventory/issue | P1 |
| 10 | فاتورة مورّد | Dr مخزون/مصروف (الصافي) + Dr ضريبة / Cr ذمم موردين | لا قيد | Missing posting | finance/المشتريات جزئي | P1 |
| 11 | استحقاق GRN (إن وُجد) | Dr مخزون / Cr GRNI | لا GRNI، استلام جزئي | Missing posting + needs design | inventory_purchase_items | P2 |
| 12 | سند صرف (دفع لمورّد) | Dr ذمم موردين / Cr نقد/بنك | لا قيد | Missing posting | finance/vouchers (غير مستخدم) | P1 |
| 13 | مرتجع مشتريات | Dr ذمم موردين / Cr مخزون | لا منطق مرتجع واضح | Missing posting | — | P2 |
| 14 | تسوية مخزون (بأثر مالي) | Dr/Cr فروقات المخزون / مخزون | لا قيد | Missing posting | inventory_stock_count | P2 |
| 15 | فاتورة ZATCA | (مطابقة قيد الفاتورة) + QR/توقيع | QR محلي فقط (لا توقيع/تقديم) | Stub + Missing posting | zatca/generate | P1 |

## ملاحظات
- كل العمليات حالياً **بلا ترحيل** (محرك مفقود) — الفجوة شاملة لا جزئية.
- القيود المتوقّعة أعلاه مُنفَّذة كدوال نقية مُختبَرة في `accounting_posting.js` (Gate 4) جاهزة للربط بعد تعبئة CoA + idempotency DDL.
- ضريبة القيمة المضافة: الإجمالي شامل 15% → صافي = الإجمالي/1.15، ضريبة = الفرق.

`IMPACT_MATRIX_COMPLETE`
