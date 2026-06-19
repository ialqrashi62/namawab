# تقرير النسخ الاحتياطي لقاعدة البيانات - الدفعة الرابعة (ICU & Nursing Database Backup Report)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا التقرير نجاح عملية النسخ الاحتياطي للجداول الطبية المستهدفة قبل البدء في أي تعديل برمي أو إدخال هجرات أمنية بقاعدة البيانات.

---

### 1. تفاصيل النسخ الاحتياطي الجدولية (Backup Details)

* **اسم قاعدة البيانات (Database Name)**: `nama_medical_web` (قاعدة بيانات Staging المحلية).
* **اسم ملف النسخة الاحتياطية (Backup Filename)**: [icu_nursing_backup.sql](./sql/icu_nursing_backup.sql).
* **الجداول المشمولة بالنسخ (Target Tables)**:
  1. `icu_monitoring`
  2. `icu_ventilator`
  3. `icu_scores`
  4. `icu_fluid_balance`
  5. `nursing_vitals`
  6. `nursing_care_plans`
  7. `nursing_assessments`
  8. `emar_orders`
  9. `emar_administrations`

---

### 2. طريقة الفحص والأمن (Methodology & Security Compliance)

* **طريقة الاستدعاء**: تم تنفيذ أداة `pg_dump.exe` المرفقة بمحرك PostgreSQL 16 محلياً.
* **الاعتمادات الأمنية**: تم تمرير كلمة المرور الخاصة بقاعدة البيانات عبر متغير بيئة مؤقت (`$env:PGPASSWORD`) أثناء التشغيل المباشر للعملية، ولم يتم توثيق أي كلمات مرور أو روابط اتصال صريحة (`DATABASE_URL`) في هذا التقرير أو السجلات لضمان أمان البيانات.
* **التحقق من سلامة الملف**: تم إنتاج الملف بنجاح وحفظه تحت مجلد `docs/sql/` وجاهزيته للاسترجاع الفوري في حال حدوث أي خطأ برمي أو انحدار في البيانات.

---

### 3. خلاصة النتيجة (Backup Verification Status)

* **حالة العملية**: **SUCCESS** (ناجحة بالكامل).
* **حجم الملف وحالة الاستقرار**: مستقر وجاهز لإجراء الفحوصات اللاحقة.
