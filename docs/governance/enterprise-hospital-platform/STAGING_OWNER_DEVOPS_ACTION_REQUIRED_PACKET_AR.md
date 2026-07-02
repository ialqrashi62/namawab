# حزمة الإجراءات المطلوبة من المالك والعمليات لتأهيل البيئة (Staging Owner/DevOps Action Required Packet)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** تجهيز بيئة الاختبار وجمع الشواهد (PHASE_OWNER_DEVOPS_STAGING_PROVISIONING_AND_EVIDENCE_CAPTURE)
* **الحالة:** محجوب - بانتظار إجراءات العمليات (STAGING_STILL_BLOCKED_OWNER_ACTION_REQUIRED) ❌

---

## 1. الإجراءات المطلوبة من المالك ومهندس العمليات (DevOps)

يجب تنفيذ المهام التالية على خادم بيئة الاختبار الجديد بشكل مستقل تماماً عن بيئة الإنتاج:

1. **توفير خادم مستقل (Host Isolation):** حجز وتهيئة خادم افتراضي (VM) أو حاوية مستقلة.
2. **إنشاء قاعدة البيانات (Database Provisioning):** إنشاء قاعدة بيانات جديدة فارغة باسم `nama_medical_staging`.
3. **إنشاء مستخدم مقيد لقاعدة البيانات (DB User):** إنشاء المستخدم `nama_staging_user` بصلاحيات كاملة على قاعدة الاختبار فقط.
4. **تأمين ملف التكوين (Staging Env File):** إنشاء وتأمين ملف `.env.staging` بصلاحيات قراءة محدودة (chmod 600).
5. **تشغيل خدمة التطبيق (PM2 Isolation):** تشغيل التطبيق كعملية مستقلة باسم `nama-app-staging`.
6. **توجيه النطاق الفرعي وتشفير TLS (Domain & SSL):** توجيه النطاق `staging.jumanasoft.com` وتفعيل شهادة SSL.
7. **عزل السجلات والنسخ الاحتياطي (Logs & Backups):** إعداد مسار سجلات معزول وجدولة النسخ الاحتياطي التلقائي لقاعدة بيانات الاختبار.

---

## 2. نماذج الأوامر المقترحة بالرموز المحجوزة (Placeholders Only)

> [!WARNING]
> يمنع منعاً باتاً استبدال الرموز المحجوزة بأي أسرار أو كلمات مرور حقيقية داخل هذا الملف أو في مستندات التقرير.

### أ. إنشاء قاعدة البيانات والمستخدم في PostgreSQL:
```sql
-- يتم تشغيلها داخل psql بصلاحيات postgres
CREATE DATABASE <STAGING_DB_NAME>;
CREATE USER <STAGING_DB_USER> WITH PASSWORD '<STAGING_DB_PASSWORD>';
GRANT ALL PRIVILEGES ON DATABASE <STAGING_DB_NAME> TO <STAGING_DB_USER>;
```

### ب. تهيئة ملف البيئة (.env.staging):
```bash
# يتم حفظ الملف في مسار المشروع /var/www/namaweb/.env.staging
PORT=3010
DB_HOST=localhost
DB_PORT=5432
DB_NAME=<STAGING_DB_NAME>
DB_USER=<STAGING_DB_USER>
DB_PASSWORD=<STAGING_DB_PASSWORD>
SESSION_SECRET=<STAGING_SESSION_SECRET>
JWT_SECRET=<STAGING_JWT_SECRET>
NODE_ENV=production
```

### ج. تشغيل خدمة التطبيق وعزل السجلات في PM2:
```bash
pm2 start server.js --name nama-app-staging --log /var/log/nama-app-staging/app.log --env staging
```

---

## 3. تسليم الأدلة والشواهد المطلوبة

بعد إتمام التجهيز، يجب على مهندس العمليات ملء البيانات غير الحساسة وتوقيع المستندات التالية المتوفرة في مجلد الحوكمة:
1. [قالب إرجاع شواهد وأدلة جاهزية بيئة الاختبار](file:///c:/Users/ice/Desktop/NamaMedical/docs/governance/enterprise-hospital-platform/OWNER_STAGING_RETURN_EVIDENCE_TEMPLATE_AR.md)
2. [نموذج توقيع واعتماد بيئة الاختبار المشترك](file:///c:/Users/ice/Desktop/NamaMedical/docs/governance/enterprise-hospital-platform/STAGING_OWNER_SIGNOFF_FORM_AR.md)

---
**القرار الفني النهائي:** يستمر حجب البيئة وتجميد العمليات البرمجية والتكاملية لحين استلام شواهد التجهيز الموقعة.
