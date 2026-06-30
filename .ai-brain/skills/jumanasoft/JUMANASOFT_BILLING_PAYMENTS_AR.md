---
name: jumanasoft-billing-payments
description: الفوترة والاشتراكات وتجريد مزوّد الدفع (Stripe + Moyasar/HyperPay) + ZATCA + idempotency في جمانة سوفت.
---

# جمانة سوفت — الفوترة والمدفوعات

## تجريد مزوّد الدفع (Payment Adapter)
واجهة واحدة، عدة مزوّدين. **Stripe الآن، Moyasar/HyperPay (السعودية) لاحقاً.**
```
interface PaymentProvider {
  createCustomer(tenant) ; createCheckout(plan, tenant) ;
  createSubscription(...) ; cancelSubscription(...) ;
  handleWebhook(rawBody, signature) -> normalized event ;
  refund(paymentId, amount) ;
}
```
- لا يتسرّب أي SDK خاص بمزوّد خارج المحوّل. اختيار المزوّد بالإعداد (`PAYMENT_PROVIDER=stripe|moyasar`).
- مرجع الأنماط: `.vendor/nextjs-saas-starter` (تدفّق Stripe + customer portal).

## الخطط والأسعار
- `plans` (code, name, price, interval, trial_days) + `plan_features` (plan_id, feature, limit).
- التفعيلات تُشتقّ من خطة الاشتراك → [[jumanasoft-multi-tenant-rbac]] (entitlements).

## دورة حياة الاشتراك
`trialing → active → past_due → canceled/expired`. مدفوعة بـ **webhooks** من المزوّد (مُطبَّعة عبر المحوّل):
- `checkout.completed` → فعّل المستأجر. `invoice.paid` → مدّد. `payment_failed` → past_due + مهلة. `subscription.deleted` → عطّل التفعيلات (لا تحذف بيانات).
- **webhook idempotent**: خزّن `event_id`؛ تجاهل المكرّر.

## سلامة المال + التكرار (إلزامي)
- أعمدة المال `NUMERIC(14,2)` (e22). استعمل `parseMoney`/`parseFloat` دائماً (ممنوع `+` خام على نص). راجع [[jumanasoft-global-gates]] G2.
- مسارات المال POST تحمل `Idempotency-Key` → `idemGuard` (replay/409/fail-open). منشور على invoices/pay/refund/journal.

## ZATCA (فاتورة إلكترونية — السعودية)
- `zatca_phase2.js` جاهز (CSR، توقيع ECDSA secp256k1، QR بـ9 وسوم، سلسلة PIH، عميل Fatoora مبوّب).
- التفعيل يحتاج CSID من بوابة فاتورة (OTP) → راجع `namaweb/ZATCA_PHASE2_READINESS.md`. مبوّب fail-closed حتى ذلك.

## بوابات
- لا فوترة بلا: تجريد مزوّد + webhook idempotent + سلامة مال + audit. راجع [[jumanasoft-global-gates]] G2/G3/G5.
