# قرار تعليق تشغيل هجرات الفوترة وطلب موارد Staging (Jumanasoft Real Staging Infra Blocked Closeout)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** تهيئة وفحص جاهزية بيئة Staging الحقيقية (PHASE_REAL_STAGING_INFRA_PROVISIONING_AND_EVIDENCE_CAPTURE)
* **البوابة:** البوابة B4 — إغلاق التعليق (Gate B4 — Blocked Closeout)
* **القرار النهائي المعتمد للمرحلة:** تعليق العمل لعدم توفر البنية وطلب إجراءات المالك (`REAL_STAGING_INFRA_BLOCKED_OWNER_ACTION_REQUIRED`) ⚠️

---

## 1. أسباب تعليق ومحاذاة التشغيل الحالي

نظراً لعدم توفر خادم استضافة تجريبي حقيقي معزول سحابياً:
1. **حظر تشغيل الهجرات:** تم تعليق تنفيذ أو تشغيل ملفات هجرة الفوترة والاشتراكات `e47` بالكامل لعدم وجود قاعدة بيانات معزولة ومحمية.
2. **تعليق بوابات الدفع:** يظل محول الفوترة مقيداً بوضع المحاكاة الوهمية (`mock-only`) ومغلقاً كلياً وقت التشغيل.
3. **حظر استقبال المدفوعات والـ Webhooks:** لا يوجد أي مسارات استقبال اتصالات حية مفعلة.

## 2. الإجراءات والخطوات المطلوبة من المالك / الديف أوبس

يُطلب من المالك ومسؤول النظام اتخاذ الإجراءات التالية للمباشرة:
1. مراجعة حزمة تسليم المتطلبات الصادرة في المستند [JUMANASOFT_REAL_STAGING_DEVOPS_HANDOFF_PACKET_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/governance/enterprise-engineering-constitution/JUMANASOFT_REAL_STAGING_DEVOPS_HANDOFF_PACKET_AR.md).
2. تهيئة الخادم الافتراضي وقاعدة البيانات `jumanasoft_staging` وصلاحيات المستخدم المقيد `NOSUPERUSER` و `NOBYPASSRLS`.
3. تعبئة وإرجاع الشواهد الفنية المطلوبة في النموذج [JUMANASOFT_REAL_STAGING_OWNER_EVIDENCE_TEMPLATE_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/governance/enterprise-engineering-constitution/JUMANASOFT_REAL_STAGING_OWNER_EVIDENCE_TEMPLATE_AR.md) للحصول على ترخيص التشغيل اللاحق.

---
**القرار:** تم صياغة وتوثيق قرار تعليق التشغيل بنجاح، ومصرح بالانتقال لـ PHASE 3 لإجراء اختبارات وضوابط الجودة النهائية للمرحلة.
