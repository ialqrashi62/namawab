# وثيقة عبور بوابة الموافقة وإطلاق التخطيط التنفيذي (Rollout Approval Gate Report)
## نظام نما الطبي (NamaMedical) - مرحلة التخطيط والتحقق

توثق هذه الوثيقة بدء وتأطير مرحلة بوابة الموافقة لتنفيذ الطرح الإنتاجي (`PRODUCTION_ROLLOUT_EXECUTION_APPROVAL_GATE`) لتأكيد جاهزية الأكواد، وإعداد الأوامر التنفيذية التفصيلية، وصياغة سجل المخاطر والتحقق قبل أي احتكاك فعلي ببيئة الإنتاج.

---

### 1. نطاق الموافقة والضوابط الصارمة (Controlled Scope & Restrictions)

بموجب الموافقة المحدودة والصريحة الصادرة من إدارة النظام الطبي، تم ضبط نطاق العمل ليكون كالتالي:

#### 🟢 الأنشطة المسموحة والمكتملة حالياً (Allowed Actions)
* قراءة خطة الطرح الإنتاجي والتحقق منها.
* التحقق من نسخة الإطلاق (Release Candidate) ومطابقة الهاشات البرمجية.
* التحقق من جاهزية بيئة الإنتاج (Production Environment Readiness).
* التحقق من خطة تشغيل Redis للإنتاج (Redis Production Plan).
* التحقق من جاهزية خطة النسخ الاحتياطي والاستعادة (Backup & Restore Readiness).
* التحقق من خطة التراجع السريع عند الطوارئ (Rollback Plan).
* إعداد أوامر التنفيذ المقترحة بدقة متناهية.
* إعداد قائمة تدقيق ما قبل التنفيذ (Pre-execution Checklist).
* تشغيل اختبارات انحدار الأمان وعزل المستأجرين محلياً على بيئة Staging فقط لإعادة التأكيد.

#### 🔴 الأنشطة المحظورة تماماً حتى صدور موافقة ثانية صريحة (Forbidden Actions)
* الولوج (SSH) إلى خادم الإنتاج.
* تعديل الملف البيئي للإنتاج (`.env`).
* تشغيل سكربت النشر أو الترقية (Deployment script).
* تشغيل أي تعديلات هيكلية (Migrations أو DDL) على الإنتاج.
* تشغيل أمر `db push` أو تعديل الجداول.
* إعادة تشغيل PM2 أو أي خدمة إنتاجية (Production Services).
* تغيير إعدادات النطاق (DNS) أو شهادات الأمان (SSL) الفعلية.
* نقل أو تعديل بيانات المرضى الفعلية.
* حذف أو استبدال أي ملفات إنتاجية.

---

### 2. وثائق حزمة الموافقة التنفيذية (Rollout Package Documents)

تتكون حزمة الموافقة الفنية الحالية من المستندات التفصيلية التالية المترابطة:

1. **وثيقة بوابة الموافقة (الوثيقة الحالية)**: [MEDICAL_PRODUCTION_ROLLOUT_APPROVAL_GATE_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/MEDICAL_PRODUCTION_ROLLOUT_APPROVAL_GATE_AR.md)
2. **التحقق من نسخة الإطلاق**: [MEDICAL_PRODUCTION_RELEASE_CANDIDATE_VERIFICATION_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/MEDICAL_PRODUCTION_RELEASE_CANDIDATE_VERIFICATION_AR.md)
3. **خطة الأوامر التنفيذية**: [MEDICAL_PRODUCTION_EXECUTION_COMMAND_PLAN_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/MEDICAL_PRODUCTION_EXECUTION_COMMAND_PLAN_AR.md)
4. **فحوصات الاستعادة والنسخ والتراجع النهائي**: [MEDICAL_PRODUCTION_BACKUP_ROLLBACK_FINAL_CHECK_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/MEDICAL_PRODUCTION_BACKUP_ROLLBACK_FINAL_CHECK_AR.md)
5. **سجل مخاطر النشر والحد منها**: [MEDICAL_PRODUCTION_DEPLOYMENT_RISK_REGISTER_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/MEDICAL_PRODUCTION_DEPLOYMENT_RISK_REGISTER_AR.md)
6. **طلب الموافقة النهائية والتنفيذية للإنتاج**: [MEDICAL_PRODUCTION_FINAL_APPROVAL_REQUEST_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/MEDICAL_PRODUCTION_FINAL_APPROVAL_REQUEST_AR.md)

---

### 3. الخلاصة وحالة بوابة العبور (Gate Conclusion & Decision)

* **حالة بيئة الإنتاج الحالية (Production Deployed)**: **NO**
* **حالة الجاهزية للإنتاج (Production Ready)**: **NO** (حتى اعتماد الخطة التنفيذية بالكامل وصدور الموافقة الثانية الصريحة).
* **حالة بوابة الموافقة (Approval Gate Status)**: **PASS** (تم صياغة المستندات وحصر الأوامر والتجربة على Staging بنجاح كامل).

> [!IMPORTANT]
> تم إيقاف كافة العمليات بانتظار الموافقة الثانية الصريحة من قبل إدارة النظام قبل لمس خادم الإنتاج أو تشغيل أي أمر.

**القرار**: تم العبور وتأطير المرحلة بنجاح بانتظار الموافقة الثانية (**Approval Gate: PASS**).
