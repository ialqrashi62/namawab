---
name: jumanasoft-billing-payments
description: الفوترة والاشتراكات وتجريد مزوّد الدفع (Stripe + Moyasar/HyperPay) + ZATCA + idempotency في جمانة سوفت.
---

# جمانة سوفت — الفوترة والمدفوعات

طبقة إدارة العمليات المالية، خطط الاشتراك، بوابات الدفع، وإصدار الفواتير المتوافقة مع هيئة الزكاة والضريبة والجمارك (ZATCA) في جمانة سوفت.

---

## إرشادات التشغيل الفعال (Progressive Disclosure)

### متى تُفعّل المهارة:
تُفعّل عند تعديل منطق الفوترة، أو دمج بوابات دفع جديدة، أو معالجة الـ webhooks الخاصة بالاشتراكات، أو ربط إصدار الفواتير بمتطلبات الفاتورة الإلكترونية ZATCA.

### المدخلات المطلوبة:
- هيكل خطة الاشتراك (الأسعار والحدود).
- معاملات بوابات الدفع ومفاتيح التجريد.
- مفاتيح منع التكرار `Idempotency-Key` للطلبات المالية.

### المخرجات المتوقعة:
- معالجة عمليات الدفع بنجاح مع عزل دورة حياة الاشتراك.
- فواتير مطابقة لمتطلبات ZATCA مع الحفاظ على سلامة البيانات المالية.

### بوابات الجودة (Gates):
- **G2** (سلامة البيانات المالية)، **G3** (منع التكرار)، **G5** (سجل التدقيق).

### شروط التوقف الفوري:
توقف فوراً في حال عدم تطابق أي قيمة مالية (أعمدة المال غير المطابقة لـ NUMERIC)، أو غياب مفاتيح منع التكرار على العمليات الحساسة، أو حدوث خلل في توقيع فواتير ZATCA.

---

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
- `checkout.completed` → فعّل المستأجر. `invoice.paid` → مدّد. `payment_failed` → past_due + مهلة. `subscription.deleted` → تعطيل التفعيلات (لا تحذف بيانات).
- **webhook idempotent**: خزّن `event_id`؛ تجاهل المكرّر.

## سلامة المال + التكرار (إلزامي)
- أعمدة المال `NUMERIC(14,2)` (e22). استعمل `parseMoney`/`parseFloat` دائماً (ممنوع `+` خام على نص). راجع [[jumanasoft-global-gates]] G2.
- مسارات المال POST تحمل `Idempotency-Key` → `idemGuard` (replay/409/fail-open). منشور على invoices/pay/refund/journal.

## ZATCA (فاتورة إلكترونية — السعودية)
- `zatca_phase2.js` جاهز (CSR، توقيع ECDSA secp256k1، QR بـ9 وسوم، سلسلة PIH، عميل Fatoora مبوّب).
- التفعيل يحتاج CSID من بوابة فاتورة (OTP) → راجع `namaweb/ZATCA_PHASE2_READINESS.md`. مبوّب fail-closed حتى ذلك.
