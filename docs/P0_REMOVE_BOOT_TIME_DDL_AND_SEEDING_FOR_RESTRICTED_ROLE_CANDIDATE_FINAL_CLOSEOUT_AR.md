# P0 — إزالة DDL/Seed من الإقلاع لتجهيز الدور المقيَّد — إغلاق نهائي

> المرحلة: `P0_REMOVE_BOOT_TIME_DDL_AND_SEEDING_FOR_RESTRICTED_ROLE_CANDIDATE` | التاريخ: 2026-06-21 | code candidate فقط — بلا نشر/restart/DDL/data/.env.
> النتيجة بسطر: عُطِّلت كل عمليات DDL/Seed الإقلاعية في الإنتاج، و**أُثبِت عملياً** أن التطبيق يقلع كدور `nama_medical_app` غير-superuser بلا أخطاء — بلا أي مساس بالإنتاج الحي.

## ما تم
- **Gate 1 جرد**: مسار الإقلاع الوحيد = `startServer()` (server.js) ⇒ `initDatabase()` + 7 دوال seed/populate + `listen`؛ زائد 3 IIFEs (ALTER) على مستوى الموديول. كل DDL الآخر داخل معالجات مسارات (لا يعمل وقت الإقلاع). لا CREATE INDEX/POLICY في الكود.
- **Gate 3 patch (server.js فقط)**: تغليف الدوال السبع + الـ3 IIFEs بـ `if (process.env.NODE_ENV !== 'production')` (متّسق مع حارس initDatabase القائم). موديولات seed لم تُعدَّل. الربط (ALS + غلاف pool.query + middleware) محفوظ.
- **Gate 4 candidates**: `docs/sql/boot_time_schema_cleanup_candidate_{up,validate,down}.sql` (idempotent، تُنفَّذ خارج-النطاق بدور superuser عند الحاجة — لم تُنفَّذ).
- **Gate 6 محاكاة محكومة**: إقلاع التطبيق في عملية منفصلة قصيرة (port 3987 لا 3000، NODE_ENV=production، الدور nama_medical_app) ⇒ سجل: "Skipping table initialization" + "skipping demo seed + catalog population" + "✅ running" + REDIS SUCCESS، **بلا** permission denied / violates RLS / Failed to start. العملية أُنهيت (لا متبقٍّ على 3987).

## الحقول
```text
FINAL_STATUS: CODE_ONLY_PUSHED_NOT_DEPLOYED
SELECTED_PHASE: P0_REMOVE_BOOT_TIME_DDL_AND_SEEDING_FOR_RESTRICTED_ROLE_CANDIDATE
APP_STATUS: ONLINE (الإنتاج port 3000 كـ postgres — لم يُمَس)
DB_ROLE_CURRENT: postgres
NAMAWEB_HEAD_BEFORE: 825390b
NAMAWEB_HEAD_AFTER: d0f1f70
PARENT_HEAD_BEFORE: 046bc9e
PARENT_HEAD_AFTER: (مُقدَّم بكوميت هذه البوابة — يُذكر في ملخص الجلسة)
BOOT_DDL_BLOCKS_FOUND: 4 (initDatabase + 3 ALTER IIFEs: system_users.last_ip, pharmacy_prescriptions_queue.doctor, audit_trail.user_name/details)
BOOT_DDL_BLOCKS_REMOVED_OR_DISABLED: 4 (initDatabase مُعطَّل مسبقاً في 825390b؛ الـ3 IIFEs عُطِّلت هذه المرحلة)
BOOT_SEED_BLOCKS_FOUND: 7 (insertSampleData[patients+], populateLabCatalog, populateRadiologyCatalog, addExtraLabTests, addExtraRadiology, populateMedicalServices, populateBaseDrugs)
BOOT_SEED_BLOCKS_REMOVED_OR_DISABLED: 7 (كلها مُغلَّفة بحارس الإنتاج هذه المرحلة)
INITDATABASE_BEHAVIOR: يحرس نفسه في الإنتاج (return مبكر — "Skipping table initialization")؛ بلا تغيير هذه المرحلة
APP_TENANT_BINDING_PRESERVED: YES (db_postgres.js: ALS + set_config('app.tenant_id') ؛ server.js: import tenantStore + middleware tenantStore.run)
POOL_WRAPPER_PRESERVED: YES (غلاف pool.query سليم)
CODE_CHANGED: YES (server.js: +33/-18)
CODE_DEPLOYED: NO
PM2_RESTARTED: NO (الإنتاج لم يُعَد تشغيله؛ المحاكاة عملية منفصلة على 3987 أُنهيت)
DDL_EXECUTED: NO
DATA_CHANGED: NO (patients=3 قبل/بعد؛ المحاكاة لم تُشغّل أي seed)
GRANT_EXECUTED: NO
ENV_CHANGED: NO (هذه المرحلة لم تمس .env)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0 (لا جدول journal_entries)
STATIC_TEST_RESULT: PASS (node --check ✓؛ لا CREATE/ALTER/INDEX/POLICY/seed في مسار الإقلاع؛ الربط+الغلاف موجودان؛ diff = server.js فقط؛ WS نظيف)
BOOT_SIMULATION_RESULT: PASS (أقلع كـ nama_medical_app super=false bypassrls=false في الإنتاج بلا أخطاء DDL/RLS)
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: APPROVE_BOOT_DDL_REFACTOR_DEPLOY_THEN_RETRY_RESTRICTED_ROLE
```

## متبقٍّ صريح (خارج نطاق الإقلاع — لا يُخفى)
DDL على مستوى المسارات (`CREATE/ALTER TABLE` داخل معالجات `app.get/post/put`: obgyn, referrals, medical_reports, cash_drawer, visit_lifecycle, pathology/cssd/cme, infection_control, maintenance, insurance_policies, inventory, pharmacy_prescriptions، …) ما زال قائماً. تحت `nama_medical_app` ستُرجِع تلك المسارات 500 عند استدعائها (تحاول CREATE وقت الطلب). **إقلاع التطبيق ≠ عمل كل المسارات تحت الدور المقيَّد.** معالجته (نقل CREATE خارج المعالجات) متابعة لاحقة منفصلة.

## صيغة الإغلاق
```text
STATUS: BOOT_TIME_DDL_AND_SEED_DISABLED_FOR_PRODUCTION — RESTRICTED_ROLE_BOOT_PROVEN (CANDIDATE, NOT DEPLOYED)
SCOPE: boot-time DDL/seed only (server.js startup path) ؛ route-level DDL deferred
PRODUCTION_READY: NO (مرشّح غير منشور؛ يلزم نشر + إعادة تبديل الدور + إثبات مسار التطبيق)
P0_OPEN: PARTIAL (الإقلاع المقيَّد محلول؛ النشر + DDL المسارات + إثبات RLS عبر التطبيق مفتوحة)
P1_OPEN: YES (DDL مستوى المسارات تحت الدور المقيَّد)
GIT_COMMITTED: YES (namaweb d0f1f70 ؛ parent docs+gitlink)
GIT_PUSHED: YES (origin بلا force)
NEXT_RECOMMENDED_PHASE: APPROVE_BOOT_DDL_REFACTOR_DEPLOY_THEN_RETRY_RESTRICTED_ROLE
```

تم اكتمال مرشح إزالة DDL والبذر من startup لتجهيز الإقلاع بدور محدود بدون نشر إنتاجي
