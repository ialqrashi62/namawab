# هيكلية وتصميم محول الفواتير المستقل عن المزود (Jumanasoft Provider-Neutral Billing Adapter Architecture)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** تصميم أساس محول الفواتير (PHASE_BILLING_ADAPTER_DESIGN_ONLY_CANDIDATE)
* **البوابة:** البوابة 2.1 — البنية المستقلة للمحول (Gate 2.1 — Provider-Neutral Architecture)
* **الحالة:** تم التصميم والاعتماد بنجاح (APPROVED) ✅

---

## 1. المفاهيم والنماذج الأساسية للهيكل المشترك (Core Concepts)

لتأمين مرونة تبديل بوابات الدفع (Stripe, Moyasar, HyperPay)، يعتمد الهيكل على نماذج بيانات مستقلة وموحدة:

* **`BillingProvider` (Interface/Base Class):** الفئة الأساسية المشتركة التي ترث منها استراتيجيات المزودين.
* **`CheckoutSessionRequest`:** نموذج طلب إنشاء جلسة دفع وهمية (يضم `tenant_id`, `plan_key`, `amount`, `currency`, `idempotency_key`).
* **`CheckoutSessionResult`:** مخرجات إنشاء جلسة الدفع (تضم `checkout_url` وهمي محلي، `provider_session_id`, `live: false`).
* **`BillingCustomer`:** معرف العميل المشترك للتعدادية.
* **`SubscriptionIntent`:** كائن يعبر عن نية إنشاء اشتراك للمستأجر.
* **`PaymentIntent`:** كائن يعبر عن عملية دفع مخصصة للباقة.
* **`WebhookEventEnvelope`:** الغلاف العام لحدث الـ Webhook المستلم لتأمين تجريد موحد للحدث.
* **`ProviderEventVerificationResult`:** نتيجة التحقق من صحة الحدث وتوقيع الـ Webhook.
* **`BillingOperationResult`:** النتيجة العامة للعملية المشتركة.
* **`BillingErrorCode`:** رموز الخطأ الموحدة للفوترة (مثل `INSUFFICIENT_LIMITS`, `PAYMENT_FAILED`, `PROVIDER_UNAVAILABLE`).

---

## 2. العمليات البرمجية الموحدة (Neutral Operations)

يحدد الهيكل واجهة برمجية موحدة للعمليات التالية (تعمل كـ Candidate فقط ودون تفعيل خارجي):

1. **`createCustomerCandidate({ tenantId, email })`:** إنشاء كائن العميل للمستأجر.
2. **`createCheckoutSessionCandidate(CheckoutSessionRequest)`:** إنشاء جلسة دفع مرشحة وإرجاع رابط mock محلي.
3. **`createSubscriptionCandidate({ tenantId, planKey })`:** تسجيل نية الاشتراك للباقة.
4. **`cancelSubscriptionCandidate({ tenantId })`:** إلغاء أو تعليق الاشتراك.
5. **`parseWebhookCandidate(rawBody, headers)`:** فحص وتحليل محتوى حدث بوابة الدفع.
6. **`verifyWebhookSignatureCandidate(rawBody, signature, secret)`:** التحقق من صحة التوقيع الأمني للحدث (يرجع دائماً بعدم التهيئة للإنتاج).
7. **`mapProviderStatus(status)`:** تحويل حالة الدفع للمزود إلى الحالة الموحدة للـ SaaS.
8. **`getProviderCapabilities()`:** الاستعلام عن خصائص بوابة الدفع (مثل دعم مدى أو Apple Pay).

---
**القرار:** تم اعتماد الهيكلية المستقلة وإحالتها للبوابة 2.2 لتحديد استراتيجيات المزودين.
