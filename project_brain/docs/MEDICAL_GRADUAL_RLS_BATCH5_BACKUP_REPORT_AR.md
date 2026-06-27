# تقرير النسخ الاحتياطي لقاعدة البيانات - Batch 5 (Backup Report)
## نظام نما الطبي (NamaMedical)

وثيقة لتوثيق حالة النسخ الاحتياطي لقاعدة البيانات قبل تفعيل RLS الدفعة الخامسة.

---

### 1. معلومات النسخة الاحتياطية (Backup Metadata)

* **حالة النسخ الاحتياطي**: `SUCCESS`
* **مسار النسخة الاحتياطية على خادم Staging**:
  `/var/www/namaweb/backups/backup_staging_before_rls_batch5.sql`
* **الحجم**: `451,061` بايت (حوالي 451 كيلوبايت)
* **وقت الإنشاء**: `2026-06-19T07:10:20+03:00` (طابع زمني: `1781842223`)
* **التحقق من سلامة الملف (Validation check)**: `PASS`
  تم إجراء فحص جاف عبر الأداة `pg_restore -l` وجلب هيكل الملف وقائمة الجداول المنسوخة بنجاح.

---

### 2. خطة التراجع والاستعادة (Rollback & Restore Plan)

* **خطة التراجع التلقائي**: متوفرة عبر السكربت [rls_staging_batch5_rollback_without_schema_change.sql](docs/sql/rls_staging_batch5_rollback_without_schema_change.sql)
* **أداة الاستعادة المعتمدة**:
  ```bash
  sudo -u postgres pg_restore -d nama_medical_web -c /var/www/namaweb/backups/backup_staging_before_rls_batch5.sql
  ```
* **تأكيد عزل السيرفر**: النسخة الاحتياطية مخزنة محلياً ببيئة Staging المعزولة ولا تحتوي على أي بيانات لمرضى حقيقيين.
