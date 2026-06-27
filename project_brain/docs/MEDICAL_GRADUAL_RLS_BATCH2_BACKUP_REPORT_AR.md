# تقرير النسخ الاحتياطي لـ RLS التدريجي - الدفعة الثانية (Staging RLS Batch 2 Backup Report)
## نظام نما الطبي - تأمين وحوكمة قواعد البيانات قبل تمكين العزل المالي

---

### 1. ملخص عملية النسخ الاحتياطي (Backup Execution Summary)

تم بنجاح أخذ نسخة احتياطية كاملة ومستقلة ثانية من قاعدة بيانات نظام نما الطبي على بيئة الاستضافة الاستباقية (Staging Server) قبل البدء في تمكين سياسات أمان السجلات (Row-Level Security) للدفعة الثانية (Batch 2):

* **مسار الملف (Backup Path)**: `/var/www/namaweb/backups/backup_staging_before_rls_batch2.sql`
* **الصيغة الهيكلية (Format)**: Custom format (Compressed `-F c`) باستخدام أداة `pg_dump` الرسمية.
* **حجم النسخة (Size)**: 442,883 بايت (~442 كيلوبايت).
* **توقيت الإنشاء**: الجمعة 19 يونيو 2026 الساعة 06:29 بالتوقيت المحلي.
* **التحقق من سلامة الملف**: **PASS** (تم إجراء مراجعة لبنية الملف وتدقيق سلامة المخطط الهيكلي بنجاح عبر pg_restore، وأظهر الفحص وجود سياسات RLS السابقة لجداول المرضى والمواعيد مفعّلة ونشطة بنجاح).

---

### 2. خطة الاستعادة والرجوع السريع (Restore & Rollback Plans)

#### أ. خطة الاستعادة الكاملة عند الطوارئ (Emergency Restore Plan):
1. إيقاف التطبيق: `pm2 stop nama-medical-erp`
2. قطع الاتصالات النشطة:
   `sudo -u postgres psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'nama_medical_web' AND pid <> pg_backend_pid();"`
3. إسقاط وإعادة بناء قاعدة البيانات:
   `sudo -u postgres psql -c "DROP DATABASE IF EXISTS nama_medical_web;"`
   `sudo -u postgres psql -c "CREATE DATABASE nama_medical_web OWNER postgres;"`
4. استعادة النسخة الاحتياطية:
   `sudo -u postgres pg_restore -d nama_medical_web -v /var/www/namaweb/backups/backup_staging_before_rls_batch2.sql`
5. إعادة تشغيل التطبيق: `pm2 start nama-medical-erp`

#### ب. خطة التراجع التدريجي (Rollback Script):
يتوفر لدينا كود برمجى معتمد لتعطيل RLS وحذف السياسات المخصصة للدفعة الثانية وإعادة قاعدة البيانات لسلامتها السابقة.

---

### 3. محددات إغلاق التقرير (Metadata Status)

STATUS:
  MEDICAL_GRADUAL_RLS_BATCH2_BACKUP_COMPLETED

BACKUP_CREATED:
  YES

BACKUP_PATH_SAFE:
  /var/www/namaweb/backups/backup_staging_before_rls_batch2.sql

BACKUP_SIZE_BYTES:
  442883

RESTORE_VALIDATION:
  PASS

ROLLBACK_PLAN:
  EXISTS
