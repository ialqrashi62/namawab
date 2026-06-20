# دليل النسخ الاحتياطي والاسترجاع والكوارث (Backup and Restore Runbook)
## نظام نما الطبي (NamaMedical) - وثيقة التسليم النهائي

يوثق هذا الدليل آليات وإجراءات أخذ النسخ الاحتياطية واسترجاع البيانات لقاعدة بيانات الإنتاج الفعلي لتفادي ضياع السجلات الطبية.

---

## 1. أخذ النسخ الاحتياطي اليدوي (Manual Database Backup)

يتم أخذ النسخ الاحتياطي الدوري لقاعدة البيانات `nama_medical_web` باستخدام أداة `pg_dump` الرسمية خارج مجلدات Git:

* **الأمر القياسي لتنفيذ النسخ الاحتياطي**:
  ```bash
  sudo -u postgres pg_dump nama_medical_web > /var/backups/nama_medical_web_backup_$(date +%F_%H-%M-%S).sql
  ```
* **شروط الحفظ الفني**:
  - يجب حفظ الملفات تحت مجلد معزول بالكامل مثل `/var/backups/`.
  - يجب ضبط صلاحيات الملف لتقتصر على مستخدم `postgres` والـ `root` فقط (صلاحيات 600).
  - يجب تجنب حفظ أو إدراج أي ملفات نسخ احتياطي داخل مجلدات المشروع أو المستودع البرمجي.

---

## 2. إجراءات استعادة قاعدة البيانات (Database Restore Process)

في حال حدوث خطأ كارثي والحاجة لاستعادة البيانات من نسخة احتياطية سابقة:

1. **إيقاف خادم التطبيق مؤقتاً** لمنع الكتابة أثناء الاستعادة:
   ```bash
   pm2 stop nama-medical-erp
   ```
2. **إعادة إنشاء قاعدة البيانات** نظيفة (لتفادي تعارض البيانات الحالية):
   ```bash
   sudo -u postgres psql -c "DROP DATABASE nama_medical_web;"
   sudo -u postgres psql -c "CREATE DATABASE nama_medical_web OWNER postgres;"
   ```
3. **استرجاع محتوى النسخة الاحتياطية**:
   ```bash
   sudo -u postgres psql -d nama_medical_web -f /var/backups/nama_medical_web_backup_XXXX.sql
   ```
4. **إعادة تفعيل صلاحيات حساب التطبيق** ومحددات FORCE RLS:
   ```bash
   # إعادة تفعيل RLS قسرياً على الجداول
   sudo -u postgres psql -d nama_medical_web -f docs/sql/production_readiness_force_rls_up.sql
   ```
5. **إعادة تشغيل التطبيق وفحص الصحة**:
   ```bash
   pm2 start nama-medical-erp
   curl -s http://localhost:3000/api/health
   ```

---

## 3. خطط الطوارئ والحفظ خارج الخادم (Offsite Storage Recommendation)

يوصى بنقل ملفات النسخ الاحتياطي اليومي آلياً إلى خوادم تخزين سحابية معزولة (مثل Amazon S3 أو MinIO) باستخدام قنوات مشفرة وضبط مدة صلاحية الملفات (Retention Policy) لمدة 30 يوماً كحد أدنى.
