# دليل التسليم التشغيلي النهائي للإنتاج (Operations Handover Final Full Production Guide)
## نظام نما الطبي (NamaMedical) - وثيقة التسليم النهائي

يوثق هذا المستند التسليم الفني والتشغيلي النهائي لنظام نما الطبي في بيئة الإنتاج الكاملة. يوضح المستند الإعداد الأساسي، والنطاق، والروابط، وموقع بقية كتب التشغيل (Runbooks) الخاصة بضمان استقرار النظام.

---

## 1. تفاصيل بيئة الإنتاج الفعلي (Production Environment Details)

تم اعتماد تشغيل بيئة الإنتاج الفعلي طبقاً للبيانات التالية:
* **النطاق الإنتاجي (Production Domain)**: `https://alfaisal-erp.com`
* **عنوان خادم الإنتاج (Production IP)**: `204.168.144.74`
* **قاعدة بيانات التطبيق**: PostgreSQL 12+ باسم `nama_medical_web` (على المنفذ المحلي 5432).
* **إعداد الجلسات الموزعة**: خادم Redis محلي (على المنفذ 6379).
* **مدير العمليات**: PM2 (الاسم البرمجي: `nama-medical-erp`).
* **خادم الويب والبروكسي**: Nginx مع توجيه منفذ 80 إلى 443 وشهادة Let's Encrypt SSL نشطة.

---

## 2. هيكل دليل التشغيل وكتب التشغيل (Runbooks Index)

لتسهيل إدارة النظام وضمان استمراريته، تم تقسيم التوثيق الفني والتسليم إلى كتب التشغيل المتخصصة التالية (مسارات نسبية خالية من أي روابط محلية مطلقة):

1. **كتاب التشغيل اليومي**: [MEDICAL_FULL_PRODUCTION_DAILY_OPERATIONS_RUNBOOK_AR.md](docs/MEDICAL_FULL_PRODUCTION_DAILY_OPERATIONS_RUNBOOK_AR.md)
   - تفاصيل دورة التشغيل والمراقبة اليومية المعتادة.
2. **دليل إدارة جلسات Redis**: [MEDICAL_FULL_PRODUCTION_REDIS_SESSION_RUNBOOK_AR.md](docs/MEDICAL_FULL_PRODUCTION_REDIS_SESSION_RUNBOOK_AR.md)
   - تفاصيل الصيانة والتأمين الموزع للجلسات.
3. **دليل قاعدة البيانات و RLS**: [MEDICAL_FULL_PRODUCTION_DATABASE_RLS_RUNBOOK_AR.md](docs/MEDICAL_FULL_PRODUCTION_DATABASE_RLS_RUNBOOK_AR.md)
   - تفاصيل حساب الاتصال المحدود وفرض أمان مستوى الصفوف.
4. **دليل النسخ الاحتياطي والاسترجاع**: [MEDICAL_FULL_PRODUCTION_BACKUP_RESTORE_RUNBOOK_AR.md](docs/MEDICAL_FULL_PRODUCTION_BACKUP_RESTORE_RUNBOOK_AR.md)
   - تفاصيل سياسات الحفظ خارج السيرفر واسترجاع البيانات عند الكوارث.
5. **دليل معالجة الحوادث والتصعيد**: [MEDICAL_FULL_PRODUCTION_INCIDENT_RESPONSE_RUNBOOK_AR.md](docs/MEDICAL_FULL_PRODUCTION_INCIDENT_RESPONSE_RUNBOOK_AR.md)
   - سيناريوهات الأعطال وإجراءات الاسترجاع العاجل.
6. **قائمة الفحص والمراقبة الدورية**: [MEDICAL_FULL_PRODUCTION_MONITORING_CHECKLIST_AR.md](docs/MEDICAL_FULL_PRODUCTION_MONITORING_CHECKLIST_AR.md)
   - جداول المتابعة اليومية والأسبوعية والشهرية للنظام.
7. **التقرير الإغلاقي النهائي للمشروع**: [MEDICAL_FULL_PRODUCTION_FINAL_PROJECT_CLOSEOUT_AR.md](docs/MEDICAL_FULL_PRODUCTION_FINAL_PROJECT_CLOSEOUT_AR.md)
   - التقييم الختامي لتطوير وعزل عيوب نظام نما الطبي.

---

## 3. التوجيه النهائي ومسؤوليات إدارة الخادم

* **سياسة إتاحة الخادم**: يمنع منعاً باتاً فتح منافذ قاعدة البيانات أو Redis خارج السيرفر المحلي.
* **إدارة التعديلات**: يجب ألا يتم تنفيذ أي تعديلات هيكلية مباشرة (DDL) أو تحديثات برمجية دون خضوعها لدورة فحص محلي أولاً واختبارات staging متكاملة.
