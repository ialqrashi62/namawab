# تأكيد قيود وحظر تشغيل بوابة الفوترة (Jumanasoft Billing Adapter Runtime Blocking Baseline)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** تصميم أساس محول الفواتير (PHASE_BILLING_ADAPTER_DESIGN_ONLY_CANDIDATE)
* **البوابة:** البوابة 0.5 — تأكيد حظر تشغيل الفوترة (Gate 0.5 — Runtime Blocking Confirmation)
* **الحالة:** تم التوثيق والفرض بنجاح (ENFORCED) ✅

---

## 1. ثوابت وحظر وضع التشغيل الحالي (Operational Constraints)

يتم فرض الحظر المطلق لوضع تشغيل الفوترة الإلكترونية محلياً طوال هذه المرحلة وفق القيود المحددة أدناه:

* **production deploy allowed:** NO ❌ (النشر لبيئة الإنتاج محظور تماماً).
* **public staging allowed:** NO ❌ (الاستضافة العامة أو تشغيل DNS خارجي محظور تماماً).
* **observe allowed:** NO ❌ (معطل للحد من أي تسجيلات غير آمنة).
* **enforce allowed:** NO ❌ (معطل بالكامل).
* **billing activation allowed:** NO ❌ (تفعيل بوابات الفوترة والاشتراكات الحية محظور تماماً).
* **live payment allowed:** NO ❌ (معاملات الدفع الحية معطلة كلياً).
* **checkout allowed:** NO ❌ (عمليات الدفع وتسجيل الخروج للعملاء معطلة).
* **webhook allowed:** NO ❌ (استقبال إشعارات الدفع التلقائي من بوابات الدفع معطل ومحجوب).

---
**الالتزام:** تظل هذه القيود صارمة ومفروضة برمجياً ولا يجوز تجاوزها إلا بعد تهيئة Staging معزول سحابياً والحصول على الموافقات الرسمية.
