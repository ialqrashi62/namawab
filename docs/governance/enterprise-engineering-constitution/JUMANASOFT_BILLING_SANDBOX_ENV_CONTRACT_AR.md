# عقد وصياغة متغيرات بيئة الفوترة المستقبلية (Jumanasoft Billing Sandbox Env Contract)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** إعداد بوابات الدفع التجريبية مستندياً (PHASE_BILLING_SANDBOX_PREP_DOCS_ONLY)
* **البوابة:** البوابة 2.2 — عقد متغيرات البيئة (Gate 2.2 — Environment Variable Contract)
* **الحالة:** تم التوثيق والفرض بنجاح (ENFORCED) ✅

---

## 1. نموذج مواصفات متغيرات البيئة (Environment Contract)

يوضح الجدول التالي المعرفات والخصائص الفنية لمتغيرات البيئة المقترحة مستقبلاً (قوالب بدون قيم):

| اسم المتغير (Env Key) | القيمة الافتراضية المقترحة | الوصف والوظيفة البرمجية |
| :--- | :---: | :--- |
| **`BILLING_PROVIDER`** | `mock` | يحدد موفر خدمة الفوترة الفعال (mock / moyasar / stripe). |
| **`BILLING_PROVIDER_MODE`** | `sandbox` | يحدد وضع الربط للبيئة (sandbox / live). |
| **`BILLING_ADAPTER_ENABLED`**| `false` | لتفعيل أو إيقاف المحول بالكامل برمجياً وقت التشغيل. |
| **`BILLING_CHECKOUT_ENABLED`**| `false` | لتفعيل أو إيقاف بوابات الدفع وجلسات الخروج للعملاء. |
| **`BILLING_WEBHOOK_ENABLED`** | `false` | لتفعيل أو إيقاف استقبال ومعالجة إشعارات الـ Webhooks. |
| **`BILLING_PROVIDER_PUBLIC_KEY_REF`**| `placeholder` | مرجع أو معرف المفتاح العام الصادر من موفر الخدمة. |
| **`BILLING_PROVIDER_SECRET_KEY_REF`**| `placeholder` | مرجع أو معرف المفتاح السري الصادر من موفر الخدمة. |
| **`BILLING_WEBHOOK_SECRET_REF`**| `placeholder` | مرجع أو معرف سر التحقق من توقيع الـ Webhook. |
| **`BILLING_ALLOWED_CURRENCIES`**| `SAR,USD` | العملات المسموح بمعالجتها من خلال المحول. |
| **`BILLING_DEFAULT_CURRENCY`**| `SAR` | العملة الافتراضية المفروضة للمعاملات والاشتراكات. |
| **`BILLING_SANDBOX_BASE_URL`**| `placeholder` | عنوان الـ API التجريبي لبوابة الموفر. |

---

## 2. قيود وقوانين الحماية البرمجية لوضع التشغيل

* **تأمين حالة التعطيل الافتراضية (Default Disabled):** تظل جميع أعلام التشغيل الفعالة (`BILLING_ADAPTER_ENABLED`, `BILLING_CHECKOUT_ENABLED`, `BILLING_WEBHOOK_ENABLED`) مساوية للقيمة **`false`** بشكل افتراضي لمنع التفعيل غير المقصود.
* **منع التعديل على ملف البيئة الحالي:** لا يجوز كتابة أو تمرير أي من هذه المفاتيح أو القيم في ملفات التكوين الحالية للمشروع `.env` أو `.env.staging` خلال هذه المرحلة.

---
**القرار:** تم تصميم عقد متغيرات البيئة وفرضه بنجاح، ومصرح بالانتقال لـ GATE 2.3 لمراجعة دليل التخزين الآمن.
