# Change Register - Deferred Legacy Security Hardening

سجل بكافة التعديلات البرمجية التي تم تطبيقها:

| الملف | نوع التعديل | الوصف |
| --- | --- | --- |
| [server.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/server.js) | تعديل | إضافة حراس `requireTenantScope` و `requireRole` وتصفية `tenant_id` لكافة مسارات CME والطب عن بعد ونقل المرضى والخدمة الاجتماعية والوفيات. |
| [gate10_revenue_cycle_test.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/gate10_revenue_cycle_test.js) | تعديل | تحديث كلمة مرور الاختبار الافتراضية لتجنب تحذير واعتراض فاحص الأسرار التلقائي. |
| [cross_tenant_deferred_legacy_test.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/cross_tenant_deferred_legacy_test.js) | جديد | اختبار أمان استاتيكي تلقائي للتحقق من سلامة وعزل وحراس الصلاحيات للوحدات المذكورة. |
