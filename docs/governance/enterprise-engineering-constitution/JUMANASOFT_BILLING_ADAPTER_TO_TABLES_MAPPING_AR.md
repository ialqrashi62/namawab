# توثيق تكامل مخطط الجداول مع محول الفواتير (Jumanasoft Billing Adapter to Tables Mapping)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** تصميم جداول الفوترة المرشحة (PHASE_BILLING_TABLES_CANDIDATE_DESIGN)
* **البوابة:** البوابة 5.1 — توثيق تكامل المحول والجداول (Gate 5.1 — Adapter Mapping Review)
* **الحالة:** تم التوثيق والربط بنجاح (DRAFT/DESIGN-ONLY) ✅

---

## 1. مخطط تفاعل محول الفوترة مع الجداول الجديدة مستقبلاً

يوضح هذا المستند كيفية تفاعل المنطق البرمجي في [billing_adapter.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/billing_adapter.js) مع جداول قاعدة البيانات عند تفعيل وضع التشغيل لاحقاً:

1. **وضع المحاكي الحالي (Mock Mode):**
   * *السلوك الحالي:* لا يقوم المحاكي بكتابة أو قراءة أي بيانات من قاعدة البيانات؛ ويقتصر على إرجاع كائنات بالذاكرة لمنع الاحتكاك وتسهيل الفحص المحلي.
2. **بدء جلسة الدفع (Checkout Session Initiation):**
   * *العملية:* `createCheckoutSessionCandidate`
   * *السلوك المستقبلي:* إدراج سجل جديد في جدول `saas_billing_checkout_sessions` لتتبع حالة الجلسة وقيمتها وعملتها وربطها بالمستأجر باستخدام `tenant_id` ومفتاح التفرد `idempotency_key`.
3. **استقبال إشعارات الدفع (Webhook Event Processing):**
   * *العملية:* `parseWebhookCandidate`
   * *السلوك المستقبلي:* إدراج الحدث الوارد بعد مطابقة توقيعه في جدول `saas_billing_webhook_events` وتغيير حالة المعالجة إلى `processed` عند نجاح المطابقة.
4. **تحديث الاشتراكات (Subscription Transitions):**
   * *العملية:* `createSubscriptionCandidate` / `cancelSubscriptionCandidate`
   * *السلوك المستقبلي:* تحديث الجدول `saas_billing_subscriptions` لتسجيل الباقة الفعالة وتواريخ الصلاحية وفترات السماح للمستأجر.
5. **توثيق المعاملات وتدقيق العمليات (Transactions & Auditing):**
   * *العملية:* تسجيل المدفوعات والعمليات المحققة.
   * *السلوك المستقبلي:* إدراج تفاصيل المدفوعات في `saas_billing_payment_transactions` وتسجيل كافة العمليات الإدارية في جدول التدقيق `saas_billing_audit_events`.

---
**القرار:** تم توثيق تكامل المحول والبيانات، ومصرح بالانتقال لـ GATE 5.2 لتحديد متطلبات التفعيل.
