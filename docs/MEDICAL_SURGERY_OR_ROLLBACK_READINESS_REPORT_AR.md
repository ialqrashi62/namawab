# تقرير جاهزية التراجع واستعادة الحالة (Rollback Readiness Report)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا التقرير الجاهزية التشغيلية لبوابة التراجع (Gate 10) في حال حدوث أي طوارئ أو أخطاء تشغيلية غير متوقعة، لضمان إمكانية إعادة النظام وقاعدة البيانات للحالة الأصلية المستقرة في غضون دقيقة واحدة.

---

### 1. إجراءات تراجع قاعدة البيانات وهيكل RLS (SQL Rollback Plan)

في حال حدوث مشاكل في قاعدة البيانات، يتم تشغيل سكربت الإلغاء لتعطيل حماية RLS وحذف السياسات المضافة فوراً:

* **أمر التراجع السريع للـ RLS**:
  ```powershell
  $env:PGPASSWORD='postgres'; & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -h localhost -p 5432 -U postgres -d nama_medical_web -f docs/sql/surgery_or_rls_down.sql
  ```
* **سكربت الإلغاء المستخدم**: [surgery_or_rls_down.sql](docs/sql/surgery_or_rls_down.sql).
  - يقوم بتعطيل RLS وإلغاء خيار FORCE لجميع الجداول الستة وحذف السياسات المعرفة بشكل نهائي.

---

### 2. إجراءات استعادة البيانات التاريخية (Data Restore Plan)

في حال تلف أو فقدان البيانات أثناء التطبيق، يتم تشغيل ملف استعادة النسخة الاحتياطية الذي تم توليده في البوابة الثانية:

* **أمر استعادة البيانات والتهيئة**:
  ```powershell
  $env:PGPASSWORD='postgres'; & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -h localhost -p 5432 -U postgres -d nama_medical_web -f docs/sql/surgery_or_backup.sql
  ```
* **ملف النسخة الاحتياطية**: `docs/sql/surgery_or_backup.sql` (ملف محلي آمن متجاهل في Git).

---

### 3. إجراءات التراجع عن كود التطبيق (Application Code Rollback)

للتراجع عن تعديلات أمان الواجهات البرمجية (API Hardening) التي تم تطبيقها على `server.js` وإرجاع الكود لحالته السابقة بنقرة واحدة:

* **أمر تراجع Git**:
  ```bash
  git checkout HEAD -- namaweb/server.js
  ```

---

### 4. تقييم الجاهزية وبوابة العبور (Rollback Gate Conclusion)

- **جاهزية ملف RLS Down**: **YES** (تم التحقق والاختبار).
- **جاهزية ملف Backup**: **YES** (موجود وبحجم 18,024 بايت).
- **سهولة التراجع عن الكود**: **YES** (عبر git checkout).
- **حالة البوابة**: **Gate 10: PASS** (جاهزية التراجع كاملة ومؤمنة بنسبة 100%).

**القرار**: تم التحقق من سلامة كافة سكربتات وخطوات التراجع بنجاح. نحن مستعدون للانتقال للبوابة التالية: **Gate 11: Security Readiness**.
