# Change Register

| الملف | نوع التغيير | السبب | قبل | بعد | الخطر | الاختبار |
|---|---|---|---|---|---|---|
| `namaweb/server.js` | تعديل | تقوية tenant/RBAC لمسارات lab/radiology | بعض routes بلا middleware صريح | routes مقيدة بـ tenant/RBAC | متوسط | static test + node check |
| `namaweb/server.js` | تعديل | حماية PHI file registry | upload لا يطبع `tenant_id` | upload يطبع `tenant_id` | متوسط | static test |
| `namaweb/server.js` | تعديل | حماية invoices/payments | بعض updates/reloads بلا tenant predicate | tenant predicates مضافة | متوسط | static test |
| `namaweb/server.js` | تعديل | تصحيح clinical records RBAC | أسماء roles داخل `requireRole` | modules `doctor/nursing/obgyn` | متوسط | static test |
| `namaweb/server.js` | تعديل | تقوية ICU/Orthopedics legacy routes | RBAC واسع وtenant middleware غائب | RBAC أدق وtenant scope | متوسط | static test |
| `namaweb/hospital_os_gate_static_test.js` | تعديل | إثبات الإغلاقات | لا يغطي هذه الموجة | يغطي Phase 1 P0 closures | منخفض | `node hospital_os_gate_static_test.js` |
| `docs/HOSPITAL_OS_PHASE1_P0_SAFETY_TENANT_RBAC_AUDIT_AR.md` | إضافة | تقرير المرحلة | غير موجود | موجود | منخفض | mojibake scan |
