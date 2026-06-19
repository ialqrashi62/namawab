# تقرير التدقيق الأمني وجاهزية الاستجابة للحوادث (Secrets, Logs & Incident Response Readiness Report)
## نظام نما الطبي (NamaMedical)

مستند يوثق نتائج فحص السجلات والأسرار والاعتمادات الأمنية، وخطة الاستجابة والتراجع في بيئة Staging.

---

### 1. نتائج تدقيق السجلات والتطهير (Secrets & Logs Audit)

* **سجلات الخادم والتطبيق (PM2 & Nginx Logs)**:
  تم فحص السجلات وتدقيقها وتبين خلوها بالكامل من أي تسريبات للمعلومات السرية مثل:
  * `DATABASE_URL` (عناوين وكلمات مرور قاعدة البيانات).
  * `SESSION_SECRET` (رموز الجلسات).
  * كلمات المرور الخاصة بالمستخدمين أو الإداريين.
* **تتبع الأخطاء (Stack Traces)**: تم حظر وعزل طباعة الأخطاء البرمجية الهيكلية للخارج، مع الاكتفاء بتسجيلها محلياً مشفرة/مفلترة.

---

### 2. جاهزية الاستجابة للحوادث والتراجع (Incident Response & Rollback Plan)

* **خطة التراجع (Rollback Plan)**:
  يتوفر لكل دفعة تفعيل (Batch 1-5) سكربت تراجع مستقل ونظيف تماماً تحت المجلد [docs/sql](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/).
* **سكربتات التراجع لـ RLS**:
  * [rls_staging_batch1_rollback_patients_appointments.sql](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/rls_staging_batch1_rollback_patients_appointments.sql)
  * [rls_staging_batch2_rollback_invoices.sql](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/rls_staging_batch2_rollback_invoices.sql)
  * [rls_staging_batch3_rollback_clinical_critical.sql](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/rls_staging_batch3_rollback_clinical_critical.sql)
  * [rls_staging_batch4_rollback_high_risk.sql](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/rls_staging_batch4_rollback_high_risk.sql)
  * [rls_staging_batch5_rollback_without_schema_change.sql](file:///c:/Users/ice/Desktop/NamaMedical/docs/sql/rls_staging_batch5_rollback_without_schema_change.sql)
* **بروتوكول الاحتواء الفوري**:
  في حال حدوث أي تسريب بيانات بين المستأجرين (Cross-Tenant Data Leak)، يتم فوراً تشغيل سكربت التراجع للدفعة المسببة دون المساس بسلامة عزل الدفعات المستقرة السابقة.
