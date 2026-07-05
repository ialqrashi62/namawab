# سجل التغييرات (Change Register) - البوابتان 9 و 10

يوثق هذا الجدول كافة الملفات التي تم إضافتها أو تعديلها خلال هذه الدورة البرمجية لدمج متطلبات البوابة 9 و 10:

| الملف | نوع التغيير | السبب | قبل | بعد | الخطر | الاختبار |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [`finance_engine.js`](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/finance_engine.js) | تعديل | إضافة ترحيل GL لقيود NPHIES | لا يوجد منطق الترحيل | ترحيل متوازن تلقائياً ومستقر | منخفض | `e10_finance_engine_test.js` |
| [`server.js`](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/server.js) | تعديل | إضافة مسار الترحيل والتأكد من المدخلات | مسار تجريبي غير مكتمل وخطأ مدخلات | مسار متكامل ومفحوص وصحيح | منخفض | `gate10_revenue_cycle_test.js` |
| [`e2e_local_smoke_test.js`](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/e2e_local_smoke_test.js) | تعديل | حماية مرونة اختبارات الدخان من حظر الحسابات | يفشل الاختبار بسبب حظر حسابه سابقاً | فحص مرن وتصفير واستعادة تلقائية | منخفض | `node e2e_local_smoke_test.js` |
| [`gate10_revenue_cycle_test.js`](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/gate10_revenue_cycle_test.js) | جديد | اختبار تكاملي شامل ومخصص للبوابة 10 | لا يوجد | اختبار كامل وتهيئة جداول وحواجز التكرار | منخفض | `node gate10_revenue_cycle_test.js` |
