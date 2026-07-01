# تصميم نماذج وجداول بيانات الفوترة المقترحة (Jumanasoft Billing Data Model Candidate)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** تصميم أساس محول الفواتير (PHASE_BILLING_ADAPTER_DESIGN_ONLY_CANDIDATE)
* **البوابة:** البوابة 2.3 — تصميم نموذج البيانات (Gate 2.3 — Data Model Candidate)
* **الحالة:** تم التصميم والتوثيق بنجاح (DESIGN_ONLY) ✅

---

## 1. تفاصيل الجداول المرشحة للفوترة (Candidate Tables)

لتأمين عمليات التعددية والاشتراكات، تم صياغة وتصميم جداول البيانات المقترحة كخطة مستقبلية (ممنوع تشغيلها كـ Migration حالياً):

### 1. جدول عملاء الفوترة (`billing_customers`)
* **الغرض:** ربط المستأجر (Tenant) بمعرف العميل لدى بوابة الدفع.
* **الأعمدة المقترحة:** `id SERIAL PRIMARY KEY`, `tenant_id INT UNIQUE`, `provider_customer_id VARCHAR`, `email VARCHAR`, `created_at TIMESTAMP`.
* **الحقول الحساسة والتشفير:** حجب معرف العميل والبريد الإلكتروني للخصوصية.
* **توقعات أمان الصفوف (RLS):** تفعيل RLS بناءً على `tenant_id`.

### 2. جدول اشتراكات المستأجرين (`billing_subscriptions`)
* **الغرض:** إدارة حالة اشتراكات الباقات وتواريخ البدء والانتهاء.
* **الأعمدة المقترحة:** `id SERIAL PRIMARY KEY`, `tenant_id INT`, `plan_key VARCHAR`, `status VARCHAR`, `current_period_start TIMESTAMP`, `current_period_end TIMESTAMP`, `cancel_at_period_end BOOLEAN`.
* **توقعات أمان الصفوف (RLS):** تفعيل RLS لمنع تداخل الاشتراكات.

### 3. جدول جلسات الدفع (`billing_checkout_sessions`)
* **الغرض:** تتبع محاولات تسجيل الخروج والدفع قبل اكتمال العملية.
* **الأعمدة المقترحة:** `id SERIAL PRIMARY KEY`, `tenant_id INT`, `plan_key VARCHAR`, `provider_session_id VARCHAR`, `status VARCHAR`, `amount REAL`, `currency VARCHAR`.

### 4. جدول المعاملات والمدفوعات (`billing_payment_transactions`)
* **الغرض:** تسجيل عمليات تحصيل المبالغ والـ captures التاريخية.
* **الأعمدة المقترحة:** `id SERIAL PRIMARY KEY`, `tenant_id INT`, `subscription_id INT`, `payment_id VARCHAR`, `amount REAL`, `currency VARCHAR`, `status VARCHAR`, `created_at TIMESTAMP`.

### 5. جدول أحداث الـ Webhooks المستلمة (`billing_webhook_events`)
* **الغرض:** تتبع وإزالة تكرار معالجة إشعارات الدفع (Idempotency).
* **الأعمدة المقترحة:** `id SERIAL PRIMARY KEY`, `provider_event_id VARCHAR UNIQUE`, `provider_name VARCHAR`, `event_type VARCHAR`, `payload JSONB`, `processed BOOLEAN`, `created_at TIMESTAMP`.

---

## 2. قيود الفرض والتكامل للبيانات (Migration Safety Matrix)

* **الفهارس والقيود (Indexes & Unique Constraints):**
  * فريد وموحد لـ `provider_event_id` في جدول أحداث الـ Webhooks لمنع تكرار معالجة نفس الحدث مرتين.
  * فهرس مخصص على `tenant_id` لجميع الجداول لتسريع التصفية وضمان كفاءة أداء RLS.
* **القرار الحاكم لتطبيق الهجرة (Migration Blocker):**
  * **تطبيق هجرة المخطط (Schema Migration Execution):** **محجوب بالكامل** ❌. يُمنع كتابة أو تشغيل أي ملفات `.sql` للهجرة لهذه الجداول حالياً؛ وتبقى كأطروحة تصميم مستندية فقط لحين توفر بيئة اختبار حقيقية معزولة سحابياً.

---
**القرار:** تم تصميم نموذج البيانات التوثيقي بنجاح، ومصرح بالانتقال لـ PHASE 3 للبت في نطاق الكود البرمجي للمحول.
