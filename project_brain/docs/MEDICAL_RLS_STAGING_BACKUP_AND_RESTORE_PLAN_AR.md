# خطة النسخ الاحتياطي والاستعادة للتشغيل التجريبي لـ RLS (Staging Database Backup & Restore Plan)
## نظام نما الطبي - تأمين وحوكمة قواعد البيانات قبل إجراء الفحوصات

---

### 1. ملخص النسخ الاحتياطي (Backup Metadata)

تم بنجاح أخذ نسخة احتياطية كاملة ومستقلة من قاعدة بيانات نظام نما الطبي على بيئة الاستضافة الاستباقية (Staging Server) قبل البدء في أي تجارب أو تشغيل تجريبي لسياسات أمان السجلات (Row-Level Security):

* **مسار النسخ الاحتياطي (Backup Path)**: `/var/www/namaweb/backups/backup_staging_before_rls.sql`
* **صيغة الملف (Format)**: Custom format (Compressed `-F c`) باستخدام أداة `pg_dump` الرسمية.
* **حجم النسخة (Size)**: 407,404 بايت (ما يعادل ~407 كيلوبايت).
* **توقيت الإنشاء**: الجمعة 19 يونيو 2026 الساعة 06:18 بالتوقيت المحلي.
* **المالك والأمان (Ownership)**: مملوكة للمستخدم `root:root` بصلاحيات معزولة، وتم فحص وتأكيد سلامة الملف واستبعاد إدراجها في مستودع Git البرمجي بشكل نهائي.

---

### 2. تدقيق ومصداقية النسخة الاحتياطية (Backup Verification)

تم التحقق من سلامة وصلاحية النسخة الاحتياطية برمجياً عبر أداة `pg_restore`:
* **الأمر المستخدم**: `sudo -u postgres pg_restore -l /var/www/namaweb/backups/backup_staging_before_rls.sql`
* **النتيجة**: **PASS** (تم جلب المخطط الهيكلي وجميع الفهارس ومصفوفات الجداول والقيود بنجاح دون أي تلف في البنية).

---

### 3. خطة الاستعادة عند الكوارث (Emergency Restore Plan)

في حالة حدوث خلل فادح لا يمكن معالجته بالطرق العادية أثناء التجربة، يتم تنفيذ الخطوات التالية لاستعادة الوضع الأصلي لقاعدة البيانات بالكامل:

1. **إيقاف خادم التطبيق**:
   `pm2 stop nama-medical-erp`
2. **فصل جلسات الاتصال النشطة بالخادم**:
   `sudo -u postgres psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'nama_medical_web' AND pid <> pg_backend_pid();"`
3. **حذف وإعادة إنشاء قاعدة البيانات**:
   `sudo -u postgres psql -c "DROP DATABASE IF EXISTS nama_medical_web;"`
   `sudo -u postgres psql -c "CREATE DATABASE nama_medical_web OWNER postgres;"`
4. **استعادة النسخة الاحتياطية بالكامل**:
   `sudo -u postgres pg_restore -d nama_medical_web -v /var/www/namaweb/backups/backup_staging_before_rls.sql`
5. **إعادة تشغيل التطبيق**:
   `pm2 start nama-medical-erp`

---

### 4. خطة التراجع السريع التجريبي (Controlled Rollback Plan)

نظراً لأن التجربة ستتم في نطاق معزول وبعقود معاملة مؤقتة (Transactions & Rollbacks)، وفي حالة الاحتياج لإلغاء RLS يدوياً دون استعادة كاملة، يتم تشغيل أوامر الإلغاء التالية:

```sql
-- تعطيل سياسة أمان السجلات
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- حذف السياسات المؤقتة الخاصة بالتجربة
DROP POLICY IF EXISTS dry_run_patients_tenant_isolation ON patients;
DROP POLICY IF EXISTS dry_run_invoices_tenant_isolation ON invoices;
DROP POLICY IF EXISTS dry_run_appointments_tenant_isolation ON appointments;
```

---

### 5. محددات إغلاق المرحلة (Metadata Status)

STATUS:
MEDICAL_RLS_STAGING_BACKUP_AND_RESTORE_PLAN_COMPLETED

BACKUP_CREATED:
YES

BACKUP_PATH_SAFE:
/var/www/namaweb/backups/backup_staging_before_rls.sql

BACKUP_SIZE_BYTES:
407404

RESTORE_VALIDATION:
PLAN_ONLY

ROLLBACK_PLAN:
EXISTS
