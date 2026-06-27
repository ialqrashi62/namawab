# P0 — جرد عمليات DDL/Seed أثناء الإقلاع (Boot-Time Inventory)

> المرحلة: `P0_REMOVE_BOOT_TIME_DDL_AND_SEEDING_FOR_RESTRICTED_ROLE_CANDIDATE` — Gate 1 | التاريخ: 2026-06-21 | فحص قراءة-فقط، بلا تعديل في هذا الـGate.
> الهدف: حصر كل عملية `CREATE/ALTER/INDEX/POLICY/seed INSERT` تعمل أثناء startup حتى يقلع التطبيق لاحقاً بدور `nama_medical_app` غير-superuser.

## المنهجية
- مسار الإقلاع الوحيد = الدالة `startServer()` (server.js:4659) المُستدعاة في النهاية (server.js:7042)، زائد ثلاث IIFEs على مستوى الموديول.
- تحقّق: مسح `^\(async`، `})();`،`setInterval/setTimeout/process.on`، `.then` ⇒ التنفيذ الوحيد على مستوى الموديول هو: اتصال Redis (server.js:59، ليس DDL)، ثلاث IIFEs للهجرة (7024/7026/7028)، و`startServer()` (7042). لا غير.
- كل DDL الآخر (CREATE/ALTER داخل `app.get/post/put`) **داخل معالجات مسارات** (مُحقّق عينياً: 5554 داخل `GET /api/obgyn/stats`، 6898 داخل `GET /api/inventory`) ⇒ لا يعمل وقت الإقلاع.

## مسار الإقلاع `startServer()` (server.js:4659–4679)
```
await initDatabase();            // 4662
await insertSampleData();        // 4663
await populateLabCatalog();      // 4664
await populateRadiologyCatalog();// 4665
await addExtraLabTests();        // 4666
await addExtraRadiology();       // 4667
await populateMedicalServices(); // 4668
await populateBaseDrugs();       // 4669
app.listen(PORT, ...);           // 4670
// catch ⇒ console.error('❌ Failed to start', ...) ; process.exit(1)  // 4676–4677
```
الدوال السبع مستوردة من: `seed_data_pg.js` (insertSampleData, populateLabCatalog, populateRadiologyCatalog)، `seed_services_pg.js` (populateMedicalServices, populateBaseDrugs)، `seed_extra_catalog.js` (addExtraLabTests, addExtraRadiology).

## الجرد المصنّف

| # | الموقع | العملية | startup؟ | الجدول | يحتاج superuser/CREATE؟ | آمن تحت nama_medical_app؟ | التصنيف | القرار |
|---|---|---|---|---|---|---|---|---|
| 1 | db_postgres.js `initDatabase()` (call @ server.js:4662) | CREATE TABLE للجداول الأساسية (+ نواة) | نعم | جداول النواة | نعم (CREATE على public) | لا (كان: permission denied) | BOOT_DDL | **مُعطَّل مسبقاً** بحارس الإنتاج (825390b) ✓ |
| 2 | `seed_data_pg.js:13` `insertSampleData()` (call 4663) | seed `INSERT INTO patients` (1001/1002/1003، بلا tenant_id) | نعم | patients | لا CREATE، لكن RLS | لا (violates RLS for patients) | BOOT_SEED | تعطيل في الإنتاج |
| 3 | `seed_data_pg.js` `populateLabCatalog()` (4664) | seed INSERT كتالوج المختبر | نعم | كتالوج المختبر | لا (DML فقط) | غالباً نعم (idempotent) | BOOT_SEED | تعطيل في الإنتاج |
| 4 | `seed_data_pg.js` `populateRadiologyCatalog()` (4665) | seed INSERT كتالوج الأشعة | نعم | كتالوج الأشعة | لا | غالباً نعم | BOOT_SEED | تعطيل في الإنتاج |
| 5 | `seed_extra_catalog.js` `addExtraLabTests()` (4666) | seed INSERT فحوص إضافية | نعم | كتالوج المختبر | لا | غالباً نعم | BOOT_SEED | تعطيل في الإنتاج |
| 6 | `seed_extra_catalog.js` `addExtraRadiology()` (4667) | seed INSERT أشعة إضافية | نعم | كتالوج الأشعة | لا | غالباً نعم | BOOT_SEED | تعطيل في الإنتاج |
| 7 | `seed_services_pg.js` `populateMedicalServices()` (4668) | seed INSERT خدمات طبية | نعم | الخدمات | لا | غالباً نعم | BOOT_SEED | تعطيل في الإنتاج |
| 8 | `seed_services_pg.js` `populateBaseDrugs()` (4669) | seed INSERT أدوية أساسية | نعم | الأدوية | لا | غالباً نعم | BOOT_SEED | تعطيل في الإنتاج |
| 9 | server.js:7024 IIFE | `ALTER system_users ADD last_ip` (DO $$ + try/catch مبتلَع) | نعم (تحميل الموديول) | system_users | نعم (مالك الجدول) | غير-قاتل (مبتلَع) لكنه DDL إقلاعي | BOOT_DDL | تعطيل في الإنتاج |
| 10 | server.js:7026 IIFE | `ALTER pharmacy_prescriptions_queue ADD doctor` (مبتلَع) | نعم | pharmacy_prescriptions_queue | نعم | غير-قاتل | BOOT_DDL | تعطيل في الإنتاج |
| 11 | server.js:7028–7033 IIFE | `ALTER audit_trail ADD user_name, details` (مبتلَع) | نعم | audit_trail | نعم | غير-قاتل | BOOT_DDL | تعطيل في الإنتاج |
| R | server.js (≈4693, 5554, 5734/5754, 5874, 6125, 6198, 6730/6731, 6755, 6770, 6792, 6809, 6867, 6889, 6898, 6970, 6977/6978 …) | CREATE/ALTER داخل معالجات مسارات | **لا** (عند الطلب) | متعددة | بعضها نعم | يفشل بـ500 تحت nama_medical_app عند الطلب، **لا عند الإقلاع** | ROUTE_HANDLER_SAFE | **توثيق فقط — لا يُلمس** (خارج نطاق الإقلاع) |
| F | server.js:59 `redisClient.connect()` ؛ DDL داخل `app.get/post` | اتصال Redis / مسارات | لا | — | لا | — | FALSE_POSITIVE / ROUTE | لا علاقة بالإقلاع |

## الخلاصة
- **عمليات الإقلاع المطلوب تعطيلها في الإنتاج**: 11 (البند 1 مُعطَّل مسبقاً؛ يبقى 2–11 = 7 دوال seed/populate + 3 IIFEs).
- **لا** `CREATE INDEX` ولا `CREATE POLICY` ولا `CREATE EXTENSION/SCHEMA` في server.js (مسح صفري) ⇒ سياسات RLS تُدار في قاعدة البيانات لا في الكود.
- **بذرة المرضى** (البند 2) هي سبب `violates RLS for patients`؛ وهي بيانات تجريبية وهمية (أسماء عرض، أرقام وهمية) — ليست PHI حقيقية.
- **متبقٍّ خارج النطاق (مهم وصريح)**: DDL على مستوى المسارات (البند R) سيظل يفشل بـ500 تحت `nama_medical_app` عند استدعاء تلك المسارات (تحاول `CREATE TABLE` عند الطلب). إقلاع التطبيق ≠ عمل كل المسارات تحت الدور المقيَّد. هذا متابعة لاحقة (نقل CREATE المسارات خارج المعالجات) — **ليس** نطاق هذه المرحلة (الإقلاع فقط).

`BOOT_TIME_DDL_SEED_INVENTORY_COMPLETE — 11 BOOT OPS (1 ALREADY GUARDED) + ROUTE-LEVEL DDL DOCUMENTED OUT-OF-SCOPE`
