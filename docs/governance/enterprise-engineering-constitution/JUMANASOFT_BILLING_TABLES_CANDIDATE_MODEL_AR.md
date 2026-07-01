# المخطط المقترح لجداول الفوترة والاشتراكات (Jumanasoft Billing Tables Candidate Model Design)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** تصميم جداول الفوترة المرشحة (PHASE_BILLING_TABLES_CANDIDATE_DESIGN)
* **البوابة:** البوابة 2.1 — تصميم الجداول المرشحة (Gate 2.1 — Candidate Tables Design)
* **الحالة:** تم التصميم والتوثيق بنجاح (DESIGN_ONLY) ✅

---

## 1. تصميم الجداول السبعة المقترحة للـ SaaS (Database Schema Candidate)

تم تخطيط جداول الفوترة لتفادي كسر أي هياكل قائمة وتأمين العزل الكامل للتعدادية:

### 1. جدول عملاء الفوترة للتعددية (`saas_billing_customers`)
* **الغرض:** ربط المستأجر بالمعرف الصادر من بوابة الدفع لاحقاً.
* **الأعمدة:**
  * `id SERIAL PRIMARY KEY`
  * `tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE`
  * `provider VARCHAR(50) NOT NULL` -- stripe, moyasar, hyperpay
  * `provider_customer_id_hash VARCHAR(255) NOT NULL` -- معرف العميل مشفر/مموه
  * `billing_email_masked VARCHAR(255) NOT NULL` -- البريد المكتوم
  * `status VARCHAR(50) DEFAULT 'active'`
  * `created_by INT`
  * `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  * `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
* **الفهارس والقيود:** قيد فريد `UNIQUE(tenant_id, provider)`.

### 2. جدول اشتراكات المستأجرين (`saas_billing_subscriptions`)
* **الغرض:** تتبع تفاصيل صلاحية وتاريخ اشتراك المستأجر بالباقة.
* **الأعمدة:**
  * `id SERIAL PRIMARY KEY`
  * `tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE`
  * `plan_key VARCHAR(50) NOT NULL` -- starter, growth, enterprise
  * `provider VARCHAR(50) NOT NULL`
  * `provider_subscription_id_hash VARCHAR(255)`
  * `status VARCHAR(50) NOT NULL` -- active, past_due, canceled
  * `current_period_start TIMESTAMP`
  * `current_period_end TIMESTAMP`
  * `cancel_at_period_end BOOLEAN DEFAULT FALSE`
  * `trial_start TIMESTAMP`
  * `trial_end TIMESTAMP`
  * `created_by INT`
  * `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  * `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
* **الفهارس:** فهرس على `tenant_id`.

### 3. جدول جلسات الدفع المرشحة (`saas_billing_checkout_sessions`)
* **الغرض:** تتبع ومطابقة عمليات الدفع المطلوبة وبدئها.
* **الأعمدة:**
  * `id SERIAL PRIMARY KEY`
  * `tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE`
  * `plan_key VARCHAR(50) NOT NULL`
  * `provider VARCHAR(50) NOT NULL`
  * `idempotency_key VARCHAR(255) UNIQUE NOT NULL`
  * `provider_session_id_hash VARCHAR(255)`
  * `status VARCHAR(50) NOT NULL` -- open, completed, expired
  * `amount_minor INT NOT NULL` -- القيمة بالهللات (SAR Halalas)
  * `currency VARCHAR(10) NOT NULL DEFAULT 'SAR'`
  * `expires_at TIMESTAMP NOT NULL`
  * `created_by INT`
  * `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  * `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

### 4. سجل مدفوعات الاشتراكات (`saas_billing_payment_transactions`)
* **الغرض:** توثيق الحركات المالية الدقيقة (بدون بيانات بطاقات).
* **الأعمدة:**
  * `id SERIAL PRIMARY KEY`
  * `tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE`
  * `provider VARCHAR(50) NOT NULL`
  * `idempotency_key VARCHAR(255) UNIQUE NOT NULL`
  * `provider_transaction_id_hash VARCHAR(255)`
  * `amount_minor INT NOT NULL`
  * `currency VARCHAR(10) NOT NULL DEFAULT 'SAR'`
  * `status VARCHAR(50) NOT NULL` -- paid, failed, refunded
  * `payment_method_type VARCHAR(50)` -- mada, creditcard, applepay
  * `failure_code VARCHAR(100)`
  * `failure_message_safe VARCHAR(255)`
  * `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  * `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

### 5. سجل أحداث بوابات الدفع (`saas_billing_webhook_events`)
* **الغرض:** تخزين ومعالجة إشعارات الـ Webhooks وإزالة تكرارها.
* **الأعمدة:**
  * `id SERIAL PRIMARY KEY`
  * `provider VARCHAR(50) NOT NULL`
  * `provider_event_id_hash VARCHAR(255) UNIQUE NOT NULL`
  * `event_type VARCHAR(100) NOT NULL`
  * `received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  * `processed_at TIMESTAMP`
  * `processing_status VARCHAR(50) DEFAULT 'pending'` -- pending, processed, failed
  * `signature_verified BOOLEAN DEFAULT FALSE`
  * `payload_hash VARCHAR(64) NOT NULL`
  * `payload_safe_jsonb JSONB` -- محتوى آمن مطهر من بطاقات الدفع والأسرار
  * `error_message_safe VARCHAR(255)`

### 6. إعدادات حسابات بوابات الدفع (`saas_billing_provider_accounts`)
* **الغرض:** الإعدادات العامة للبوابات (بدون أسرار).
* **الأعمدة:**
  * `id SERIAL PRIMARY KEY`
  * `provider VARCHAR(50) UNIQUE NOT NULL`
  * `mode VARCHAR(20) DEFAULT 'sandbox'` -- sandbox, live
  * `enabled BOOLEAN DEFAULT FALSE`
  * `public_label VARCHAR(100)`
  * `capabilities_jsonb JSONB`
  * `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  * `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

### 7. سجل مراقبة وتدقيق عمليات الفوترة (`saas_billing_audit_events`)
* **الغرض:** الحفاظ على سجل تدقيق غير قابل للتغيير للعمليات المالية والإدارية.
* **الأعمدة:**
  * `id SERIAL PRIMARY KEY`
  * `tenant_id INT REFERENCES tenants(id) ON DELETE SET NULL`
  * `actor_user_id INT NOT NULL`
  * `actor_role VARCHAR(50) NOT NULL`
  * `action VARCHAR(100) NOT NULL`
  * `target_type VARCHAR(100)`
  * `target_id INT`
  * `safe_metadata_jsonb JSONB`
  * `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

---
**القرار:** تم تصميم المخطط التفصيلي للجداول السبعة، ومصرح بالانتقال لـ GATE 2.2 لتصميم حماية RLS.
