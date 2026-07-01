# تصميم سياسات حماية البيانات للفوترة وعزل المستأجرين (Jumanasoft Billing Tables RLS Design)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** تصميم جداول الفوترة المرشحة (PHASE_BILLING_TABLES_CANDIDATE_DESIGN)
* **البوابة:** البوابة 2.2 — تصميم عزل المستأجرين (Gate 2.2 — RLS & Tenant Isolation)
* **الحالة:** تم التصميم والاعتماد بنجاح (APPROVED) ✅

---

## 1. نموذج عزل المستأجرين المعتمد لبيانات الفوترة

يتطابق منطق عزل المستأجرين (Multi-Tenant Isolation) لجداول الفوترة مع نمط المنصة المعتمد في هجرات قواعد البيانات السابقة:

* **المتغير الحاكم وقت التشغيل (Session Variable):**
  * `current_setting('app.tenant_id', true)`
* **الصيغة الحاكمة في السياسات (USING/CHECK):**
  * `tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer`

---

## 2. سياسات حماية الصفوف المرشحة لجداول الفوترة (Candidate RLS Policies)

سيتم تطبيق `ROW LEVEL SECURITY` و `FORCE ROW LEVEL SECURITY` على جميع الجداول التي تضم العمود `tenant_id` لمنع تداخل القراءة والكتابة:

### 1. جدول `saas_billing_customers`
* **السياسة:**
  ```sql
  ALTER TABLE saas_billing_customers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE saas_billing_customers FORCE ROW LEVEL SECURITY;
  CREATE POLICY tenant_billing_customers_policy ON saas_billing_customers
      USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
      WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
  ```

### 2. جدول `saas_billing_subscriptions`
* **السياسة:**
  ```sql
  ALTER TABLE saas_billing_subscriptions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE saas_billing_subscriptions FORCE ROW LEVEL SECURITY;
  CREATE POLICY tenant_billing_subscriptions_policy ON saas_billing_subscriptions
      USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
      WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
  ```

### 3. جدول `saas_billing_checkout_sessions`
* **السياسة:**
  ```sql
  ALTER TABLE saas_billing_checkout_sessions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE saas_billing_checkout_sessions FORCE ROW LEVEL SECURITY;
  CREATE POLICY tenant_checkout_sessions_policy ON saas_billing_checkout_sessions
      USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
      WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
  ```

### 4. جدول `saas_billing_payment_transactions`
* **السياسة:**
  ```sql
  ALTER TABLE saas_billing_payment_transactions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE saas_billing_payment_transactions FORCE ROW LEVEL SECURITY;
  CREATE POLICY tenant_payment_transactions_policy ON saas_billing_payment_transactions
      USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
      WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
  ```

---

## 3. ضوابط حماية إعدادات المزودين والتدقيق (Super Admin Guards)

* **جدول إعدادات حسابات بوابات الدفع (`saas_billing_provider_accounts`):**
  * لا يملك هذا الجدول عمود `tenant_id` كونه يحتوي إعدادات عامة للنظام.
  * **الحماية:** يتم عزل هذا الجدول برمجياً على مستوى الخادم (Server-side check) بحيث يمنع أي مستخدم عادي من التعديل عليه، ويسمح فقط للـ Super Admin بالوصول والإدارة.
* **جدول سجل مراقبة وتدقيق عمليات الفوترة (`saas_billing_audit_events`):**
  * يتم تطبيق RLS لحماية السجلات بحيث لا يرى المستأجر إلا أحداث التدقيق الخاصة به، بينما يملك الـ Super Admin القدرة على قراءة تدقيق كافة المستأجرين عبر الخادم وليس بتعطيل RLS عشوائياً.

---
**القرار:** تم تصميم معايير عزل المستأجرين ومطابقتها للمواصفات، ومصرح بالانتقال لـ GATE 2.3 لتصميم منطق التفرد.
