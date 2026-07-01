# توثيق وتصميم هجرات الفوترة والاشتراكات للـ SaaS (Jumanasoft Billing Tables Candidate Migration Design)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** تصميم جداول الفوترة المرشحة (PHASE_BILLING_TABLES_CANDIDATE_DESIGN)
* **البوابة:** البوابة 3.3 — توثيق هجرات الفوترة (Gate 3.3 — Candidate Migration Design)
* **الحالة:** تم التصميم والتوثيق بنجاح (APPROVED) ✅

---

## 1. تفاصيل ملفات الهجرة والتثبيت المرشحة لـ e26

تم تصميم وحفظ ملفات الهجرة الخاصة بجداول الفوترة الجديدة في المجلد الفرعي للمخططات دون تشغيلها:

1. **ملف الإنشاء والتهيئة للمخطط (`e26_billing_tables_candidate_up.sql`):**
   * *الموقع:* [e26_billing_tables_candidate_up.sql](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/migrations/e26_billing_tables_candidate_up.sql)
   * *الوظيفة:* يحتوي على أوامر إنشاء الجداول السبعة للـ SaaS، وبناء الفهارس لتسريع الاستعلام، وتفعيل حماية RLS وسياسات عزل التعددية لكل جدول.
2. **ملف التراجع والتصفية التلقائية (`e26_billing_tables_candidate_down.sql`):**
   * *الموقع:* [e26_billing_tables_candidate_down.sql](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/migrations/e26_billing_tables_candidate_down.sql)
   * *الوظيفة:* تراجع آمن ومنظم؛ يبدأ بإلغاء سياسات RLS ثم حذف الجداول السبعة دون التسبب في كسر الكيانات الأخرى.
3. **ملف فحص الجودة والمطابقة للـ SQL (`e26_billing_tables_candidate_validate.sql`):**
   * *الموقع:* [e26_billing_tables_candidate_validate.sql](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/migrations/e26_billing_tables_candidate_validate.sql)
   * *الوظيفة:* استعلام قراءة آمن يرجع القيمة `all_ok = true` في حال نجاح بناء المخطط وخلوه التام من أي حقول حساسة تخص بطاقات الدفع أو الأسرار الحية.

---

## 2. معايير الأمن والحماية المفروضة على ملفات الهجرة (Safety Metrics)

* **حظر العمليات التخريبية (Additive-Only in Up):** لا يحتوي ملف `up` على أي أوامر `DROP` أو `TRUNCATE` أو `ALTER` تخريبية للبيانات.
* **سرية وأمان البيانات المالية:** يمنع منعاً باتاً وجود حقول مثل `card_number` أو `cvv` أو أي مفاتيح تشفير حقيقية داخل الجداول.
* **فرض عزل التعددية:** تم إقران جميع الجداول المرتبطة ببيانات المستأجرين بسياسات RLS صريحة ومطابقة لخط الأساس المعتمد.

---
**القرار:** تم تصميم وثائق وملفات الهجرة وحفظها بنجاح، ومصرح بالانتقال لـ PHASE 4 لتشغيل اختبارات التحقق الساكن (Static SQL Safety Tests).
