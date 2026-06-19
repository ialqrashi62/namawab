# تقرير النسخ الاحتياطي لـ RLS التدريجي - الدفعة الأولى (Staging RLS Batch 1 Backup Report)
## نظام نما الطبي - تأمين وحوكمة قواعد البيانات قبل تمكين العزل

---

### 1. ملخص عملية النسخ الاحتياطي (Backup Execution Summary)

تم بنجاح أخذ نسخة احتياطية كاملة ومستقلة من قاعدة بيانات نظام نما الطبي على بيئة الاستضافة الاستباقية (Staging Server) قبل البدء في تمكين سياسات أمان السجلات (Row-Level Security) للدفعة الأولى (Batch 1):

* **مسار الملف (Backup Path)**: `/var/www/namaweb/backups/backup_staging_before_rls_batch1.sql`
* **الصيغة الهيكلية (Format)**: Custom format (Compressed `-F c`) باستخدام أداة `pg_dump` الرسمية.
* **حجم النسخة (Size)**: 407,403 بايت (~407 كيلوبايت).
* **توقيت الإنشاء**: الجمعة 19 يونيو 2026 الساعة 06:24 بالتوقيت المحلي.
* **التحقق من سلامة الملف**: **PASS** (تم إجراء مراجعة لبنية الملف وتدقيق سلامة المخطط الهيكلي بنجاح عبر pg_restore).

---

### 2. خطة الاستعادة والرجوع السريع (Restore & Rollback Plans)

#### أ. خطة الاستعادة الكاملة عند الطوارئ (Emergency Restore Plan):
في حالة حدوث عطل شامل غير قابل للمعاودة أثناء تفعيل RLS:
1. إيقاف التطبيق: `pm2 stop nama-medical-erp`
2. قطع الاتصالات النشطة:
   `sudo -u postgres psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'nama_medical_web' AND pid <> pg_backend_pid();"`
3. إسقاط وإعادة بناء قاعدة البيانات:
   `sudo -u postgres psql -c "DROP DATABASE IF EXISTS nama_medical_web;"`
   `sudo -u postgres psql -c "CREATE DATABASE nama_medical_web OWNER postgres;"`
4. استعادة النسخة الاحتياطية:
   `sudo -u postgres pg_restore -d nama_medical_web -v /var/www/namaweb/backups/backup_staging_before_rls_batch1.sql`
5. إعادة تشغيل التطبيق: `pm2 start nama-medical-erp`

#### ب. خطة التراجع التدريجي (Rollback Script):
يتوفر لدينا كود برمجى معتمد ومثبت مسبقاً لتعطيل RLS وحذف السياسات المخصصة للدفعة الأولى وإعادة قاعدة البيانات لسلامتها الافتراضية دون إسقاط الجداول أو التعديل في البيانات.

---

### 3. محددات إغلاق التقرير (Metadata Status)

STATUS:
  MEDICAL_GRADUAL_RLS_BATCH1_BACKUP_COMPLETED

BACKUP_CREATED:
  YES

BACKUP_PATH_SAFE:
  /var/www/namaweb/backups/backup_staging_before_rls_batch1.sql

BACKUP_SIZE_BYTES:
  407403

RESTORE_VALIDATION:
  PASS

ROLLBACK_PLAN:
  EXISTS
