# MEDICAL_RLS_STAGING_ENABLEMENT_SKILL_AR

## الهدف

إدارة أي مرحلة تخص Row Level Security على بيئة Staging لنظام NamaMedical بطريقة آمنة، تدريجية، قابلة للتراجع، وموثقة بالكامل.

## المبادئ

* RLS لا يتم تفعيله دائماً إلا بعد dry-run ناجح.
* أي تجربة RLS يجب أن تكون مسبوقة بـ backup.
* أي تجربة RLS يجب أن تحتوي على rollback في finally.
* الحالة النهائية بعد dry-run يجب أن تكون:
  RLS_FINAL_STATE: DISABLED
* يمنع ترك policies مؤقتة.
* يمنع تشغيل RLS على كل الجداول دفعة واحدة.
* يبدأ النطاق دائماً بجداول قليلة:
  * patients
  * invoices
  * appointments

## شروط السماح بالتجربة

* HTTPS يعمل.
* Git clean أو مفهوم.
* backup متاح.
* restore plan موجود.
* tenant_id موجود في الجداول المستهدفة.
* لا توجد rows critical بدون tenant_id أو موثقة.
* withTenantTransaction أو equivalent موجود ومختبر.
* smoke tests تعمل قبل التجربة.

## قواعد الإيقاف

توقف فوراً إذا:

* backup فشل.
* RLS test فشل.
* rollback فشل.
* RLS بقي enabled.
* policies بقيت.
* logs أظهرت أسرار.
* database exposure للعامة.
* schema غير متوقع.
* أي migration غير مصرح.

## مخرجات إلزامية

* تقرير عربي UTF-8.
* تحديث AI_PROJECT_MEMORY.md.
* status واضح.
* DB_CHANGED مصنف بدقة:
  * YES_STAGING_TEMPORARY_ONLY
  * أو NO
* RLS_FINAL_STATE موثق.
* BACKUP_CREATED موثق.
* ROLLBACK_VERIFIED موثق.
