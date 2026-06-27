# تقرير النسخ الاحتياطي لهجرة معرف المستأجر (Backfill Migration Backup Report)
## نظام نما الطبي (NamaMedical)

توثيق نجاح عملية النسخ الاحتياطي الكاملة والتحقق الهيكلي قبل البدء في تعديلات الجداول وإضافة عمود معرف المستأجر.

---

### 1. بيانات النسخة الاحتياطية (Backup Details)

* **حالة العملية**: `SUCCESS`
* **المسار الآمن للنسخة**:
  `/var/www/namaweb/backups/backup_staging_before_tenant_id_backfill.sql`
* **الحجم**: `454,058` بايت (حوالي 454 كيلوبايت)
* **الطابع الزمني (Timestamp)**: `2026-06-19T07:19:22+03:00` (طابع زمني: `1781842762`)
* **التحقق من سلامة الملف**: `PASS`
  تم إجراء فحص جاف عبر `pg_restore -l` والتحقق من سلامة الهيكل بالكامل.

---

### 2. خطة التراجع السريع والاسترداد (Rollback & Recovery Plan)

* **التراجع التلقائي (Automatic Rollback)**: متوفر بالكامل عبر السكربت [tenant_id_backfill_controlled_migration_down.sql](docs/sql/tenant_id_backfill_controlled_migration_down.sql)
* **الاسترداد الكارثي (Disaster Recovery)**:
  ```bash
  sudo -u postgres pg_restore -d nama_medical_web -c /var/www/namaweb/backups/backup_staging_before_tenant_id_backfill.sql
  ```
