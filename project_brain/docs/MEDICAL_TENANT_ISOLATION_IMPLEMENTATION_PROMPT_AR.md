# برومنت تنفيذ عزل المستأجرين والمنشآت (Tenant Isolation Implementation Prompt)

هذا الملف يحتوي على برومنت التنفيذ الكامل والموجه للذكاء الاصطناعي لبدء مرحلة التنفيذ الفعلي لعزل البيانات والمستأجرين، بناءً على مخرجات دراسة التصميم. **لا تقم بتشغيل هذا البرومنت في المرحلة الحالية.**

---

```markdown
ابدأ المرحلة التالية بعنوان:

Tenant & Facility Isolation Migration Implementation

الاعتماد:
- docs/MEDICAL_TENANT_ISOLATION_MIGRATION_DESIGN_REPORT_AR.md
- docs/MEDICAL_DATABASE_TENANT_ISOLATION_AUDIT_AR.md
- .ai-brain/AI_PROJECT_MEMORY.md

الهدف:
تنفيذ الهيكل البرمجي والمخطط الهيكلي لقاعدة البيانات لعزل المستأجرين والمنشآت منطقياً، وتعديل استعلامات APIs في server.js وتطبيق RLS وقيود الفلترة، مع حماية البيانات الحالية وترحيلها.

القواعد الصارمة:
- لا تلمس بيئة الإنتاج الحية.
- أي تعديل في قاعدة البيانات يجب أن يتم عبر سكربت هجرة آمن (Migration Script) يضيف الحقول كـ Nullable أولاً.
- عمل Backfill لجميع البيانات القائمة لترتبط بالمستأجر والمنشأة الافتراضية (Default Tenant ID = 1, Facility ID = 1).
- بعد نجاح الـ Backfill، يتم تحويل الحقول الأمنية إلى NOT NULL.
- تفعيل الفهارس المشتركة (Composite Indexes) لضمان سرعة الأداء.
- كل التقارير باللغة العربية و UTF-8.

المطلوب:
1. إنشاء جداول المستأجرين والفروع والمنشآت والمطابقة الطبية في db_postgres.js:
   - tenants
   - facilities
   - branches
   - departments
   - user_tenants
   - user_facilities
   - tenant_roles
   - tenant_settings
   - patient_tenant_scope
   - audit_tenant_scope

2. كتابة وتشغيل سكربت الهجرة والـ Backfill للبيانات الحالية لتعيين Tenant ID = 1 و Facility ID = 1 لجميع السجلات الحالية في الجداول الطبية والمالية والتشغيلية.

3. تحويل الحقول المضافة إلى NOT NULL وإضافة الفهارس المشتركة (Composite Indexes) لضمان تحسين سرعة الاستعلامات.

4. تعديل middleware المصادقة والجلسة في server.js لاستخراج tenant_id و facility_id ديناميكياً وإلحاقها بكائن الطلب (req.tenantId, req.facilityId).

5. تعديل استعلامات SQL لجميع نهايات API الحساسة في server.js لتصفية البيانات بناءً على tenant_id و facility_id ومنع تسريب البيانات بين العيادات والمنشآت.

6. تفعيل سياسات حماية مستوى الصف (PostgreSQL Row-Level Security - RLS) كجدار حماية إضافي على جداول المرضى والفواتير والسجلات الطبية.

7. تشغيل اختبارات المراجعة للتحقق من عدم وجود أي ثغرات IDOR أو تسريب بيانات بين المنشآت الطبية المختلفة.

8. إنشاء تقرير:
docs/MEDICAL_TENANT_ISOLATION_MIGRATION_IMPLEMENTATION_REPORT_AR.md

9. حدّث:
.ai-brain/AI_PROJECT_MEMORY.md

10. نفذ commit و push بعد نجاح عملية التفعيل والتحقق.

STATUS:
MEDICAL_TENANT_ISOLATION_MIGRATION_IMPLEMENTATION_COMPLETED

PRODUCTION_TOUCHED:
NO

DB_CHANGED:
YES

MIGRATIONS_RUN:
YES

TESTS_RUN:
اذكر الاختبارات

REPORTS_CREATED:
اذكر التقارير

NEXT_RECOMMENDED_PHASE:
Hard Delete Replacement أو Telemedicine Module Expansion حسب التوجه
```
