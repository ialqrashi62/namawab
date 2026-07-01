# دليل تشغيل هجرة جداول الفوترة على بيئة Staging مستقبلاً (Jumanasoft Billing Tables e26 Staging Runbook)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** تصميم جداول الفوترة المرشحة (PHASE_BILLING_TABLES_CANDIDATE_DESIGN)
* **البوابة:** البوابة 7.1 — دليل التشغيل المستقبلي (Gate 7.1 — Future e26 Staging Runbook)
* **الحالة:** مسودة للتشغيل والتخطيط فقط (DRAFT / PLAN ONLY) ⚠️

---

## 1. المتطلبات والخطوات التحضيرية قبل الهجرة (Prerequisites)

يمنع تشغيل هذا الدليل دون التأكد التام من استيفاء البنود التالية:

* **بيئة الاستضافة المعزولة:** التأكد من تفعيل بيئة Staging مستقلة تماماً سحابياً والتأكد من عدم اتصالها بقاعدة بيانات الإنتاج الفعلي.
* **النسخ الاحتياطي (Backup):** أخذ نسخة احتياطية كاملة من قاعدة بيانات Staging قبل بدء تشغيل ملفات SQL.
* **البيانات المعقمة (Sanitized Data):** إثبات تعقيم كافة جداول المرضى والموظفين والملفات الطبية والتحقق من عدم وجود أي معلومات حقيقية (`suspicious_count = 0`).

---

## 2. خطوات تشغيل الهجرة والتحقق (Deployment Steps)

عند توفر المتطلبات، يقوم مهندس العمليات بتنفيذ الأوامر التالية بالترتيب:

### الخطوة 1: تشغيل الهجرة الصاعدة (Run Up Migration)
قم بتشغيل ملف الهجرة الصاعد لبناء الجداول والسياسات:
```bash
psql -h $DB_HOST -U $DB_USER -d jumanasoft_staging -f namaweb/migrations/e26_billing_tables_candidate_up.sql
```

### الخطوة 2: فحص وصمامات التحقق (Run Validation)
قم بتشغيل ملف التحقق للتأكد من سلامة الجداول والسياسات:
```bash
psql -h $DB_HOST -U $DB_USER -d jumanasoft_staging -f namaweb/migrations/e26_billing_tables_candidate_validate.sql
```
* **الشرط:** يجب أن تكون الاستجابة لـ `all_ok` هي `true` (أو `t` في مخرجات postgres).

### الخطوة 3: التحقق من حماية RLS وعزل البيانات (Check RLS)
قم بالاستعلام عن الجداول والتأكد من فرض الحماية وعدم إمكانية قراءة أي صفوف دون تعيين معرف المستأجر:
```sql
-- يجب أن يعيد 0 صفوف في حال عدم تعيين tenant_id في الجلسة
SELECT * FROM saas_billing_subscriptions;
```

### الخطوة 4: تشغيل اختبارات التحقق الساكن (Run Static Tests)
شغّل الفحص البرمجي للتأكد من خلو الملفات من أخطاء المخطط:
```bash
node namaweb/billing_tables_candidate_static_test.js
```

---

## 3. خطة التراجع السريع عند حدوث خطأ (Rollback Runbook)

في حال فشل أي من الخطوات أو توقف الفحوصات، يتم فوراً تشغيل ملف الهجرة الهابط لإعادة قاعدة البيانات لحالتها السابقة ومسح الجداول والسياسات المضافة:
```bash
psql -h $DB_HOST -U $DB_USER -d jumanasoft_staging -f namaweb/migrations/e26_billing_tables_candidate_down.sql
```

---
**القرار:** تم تسجيل دليل التشغيل المستقبلي، ويحظر تطبيقه حالياً على أي قاعدة بيانات.
