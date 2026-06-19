# خطة تعبئة وتحديث البيانات لقسم العمليات - موديول العمليات
## نظام نما الطبي (NamaMedical) - بيئة Staging

توثق هذه الخطة منهجية تهيئة وهجرة وتعبئة بيانات المستأجرين (Tenant Backfilling & Migration Plan) لموديول العمليات الجراحية وغرف العمليات على بيئة Staging وسبل تأمين الهجرة للإنتاج مستقبلاً.

---

### 1. تحليل البيانات القائمة في بيئة الاستضافة الاستباقية (Staging Data Analysis)

تم إجراء تدقيق واستكشاف عددي شامل لكافة سجلات الجداول المستهدفة بالتأمين في قاعدة بيانات PostgreSQL للوقوف على مدى حاجتها للتعبئة (Backfill):

* **جداول خالية تماماً من البيانات (0 صفوف)**:
  - `surgeries`
  - `surgery_preop_assessments`
  - `surgery_preop_tests`
  - `surgery_anesthesia_records`
  - `consent_forms`
  * **القرار**: **NO_BACKFILL_NEEDED** (لا تتطلب هذه الجداول أي تعبئة أو تحديث للقيم الفارغة لعدم وجود سجلات تاريخية فيها على Staging).

* **جداول تحتوي على بيانات تشغيلية (Operating Data)**:
  - `operating_rooms`: يحتوي على 4 سجلات لغرف العمليات الافتراضية.
  - **حالة العزل**: كافة الصفوف الـ 4 مختومة مسبقاً بمعرّف المستأجر `tenant_id = 1` ومعرّف الفرع `branch_id = 1`.
  * **القرار**: **NO_BACKFILL_NEEDED** (البيانات صحيحة ومطابقة ومستوفية لشروط عزل المستأجرين).

---

### 2. خطة تهيئة وتعبئة بيانات الإنتاج الفعلي (Production Migration Plan)

عند الانتقال بالدفعة الخامسة إلى خادم الإنتاج الفعلي (Production Server)، قد تتوفر سجلات تاريخية تحتوي على قيم فارغة NULL لـ `tenant_id` أو `facility_id`. تشمل الخطة الخطوات التالية:

1. **النسخ الاحتياطي الإلزامي (Mandatory Backup)**:
   - أخذ نسخة احتياطية كاملة لقاعدة البيانات باستخدام `pg_dump.exe` قبل تنفيذ أي عمليات تحديث.
2. **سكربت التحديث البرمجي (Backfill SQL Script)**:
   - تحديث سجلات العمليات التاريخية بناءً على تبعية المريض المتصل بالعملية:
     ```sql
     UPDATE surgeries s
     SET tenant_id = p.tenant_id, facility_id = p.facility_id
     FROM patients p
     WHERE s.patient_id = p.id AND s.tenant_id IS NULL;
     ```
   - تحديث سجلات التخدير والتحضير بناءً على العملية التابعة لها:
     ```sql
     UPDATE surgery_anesthesia_records ar
     SET tenant_id = s.tenant_id, facility_id = s.facility_id
     FROM surgeries s
     WHERE ar.surgery_id = s.id AND ar.tenant_id IS NULL;
     ```
3. **تحديث الموافقات الطبية**:
   - ربط الموافقات بالمستأجر بناءً على المريض أو العملية:
     ```sql
     UPDATE consent_forms cf
     SET tenant_id = p.tenant_id, facility_id = p.facility_id
     FROM patients p
     WHERE cf.patient_id = p.id AND cf.tenant_id IS NULL;
     ```

---

### 3. خطة التراجع الفوري وضمان الاستمرارية (Rollback & Contingency Plan)

في حال حدوث أي توقف أو خلل تشغيلي أثناء تطبيق الهجرة في المستقبل:
- **التراجع عن البيانات**: نظراً لأن الهجرة لا تغير نوع الأعمدة بل تملأ القيم الفارغة فقط، فإن التراجع الهيكلي غير مطلوب للبيانات، ويكتفى باستعادة النسخة الاحتياطية المأخوذة فوراً.
- **التراجع عن RLS (RLS Rollback)**: في حال حدوث مشاكل في صلاحيات التطبيق بعد تفعيل RLS لاحقاً، يتم تشغيل أوامر تعطيل RLS وحذف السياسات المضافة لإعادة النظام للحالة البرمجية الآمنة السابقة:
  ```sql
  ALTER TABLE surgeries DISABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS rls_surgeries_tenant_isolation ON surgeries;
  ```
