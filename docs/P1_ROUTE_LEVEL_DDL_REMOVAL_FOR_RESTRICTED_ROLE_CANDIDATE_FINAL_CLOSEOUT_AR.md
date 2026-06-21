# P1 — مراقبة ما بعد الدور المقيَّد + مرشح إزالة DDL من المسارات — إغلاق نهائي

> المرحلة: `P0_RESTRICTED_ROLE_POST_DEPLOY_MONITORING_THEN_ROUTE_LEVEL_DDL_REFACTOR_CANDIDATE` | التاريخ: 2026-06-21 | code candidate فقط — بلا نشر/restart/DDL/data/GRANT.

## ملخص
- **مراقبة ما بعد النشر (Gates 0–2)**: التطبيق مستقر بدور `nama_medical_app` (super=false, bypassrls=false)؛ health 5/5؛ restarts ثابتة (34)؛ سجلات نظيفة (لا blockers)؛ accounting OFF؛ **إثبات الربط عبر مسار التطبيق أُعيد ونجح** (ctx1→app.tenant_id=1+patients=3، 999→0، بلا سياق→0).
- **جرد + خطة + مرشّحات (Gates 3–5)**: جرد كامل لـDDL المسارات؛ خطة Batch A/B/C؛ 3 ملفات SQL candidate (لم تُنفَّذ).
- **patch كود (Gate 6)**: أُزيلت **Batch A** (10 مواضع: obgyn، referrals×2، medical_reports×3، cash_drawer، visit_lifecycle×3) من المعالجات (server.js: +9/-110). الربط/الغلاف محفوظان.
- **🔴 اكتشاف حاسم (تحقّق فعلي)**: **13 من جداول المسارات غير موجودة في الإنتاج** (كل جداول Batch A منها) — المسارات الثانوية لم تُستدعَ قط فلم تُنشأ. ⇒ إزالة الكود وحدها تحوّل الفشل من 42501 (CREATE) إلى 42P01 (جدول مفقود) — نفس 500. **الإصلاح الكامل = الكود + تشغيل migration candidate (superuser) لإنشاء الجداول، معاً (SQL أولاً)**.

## الحقول
```text
FINAL_STATUS: CODE_ONLY_PUSHED_NOT_DEPLOYED
SELECTED_PHASE: P0_RESTRICTED_ROLE_POST_DEPLOY_MONITORING_THEN_ROUTE_LEVEL_DDL_REFACTOR_CANDIDATE
DB_ROLE_CURRENT: nama_medical_app
APP_ROLE_SUPERUSER: false
APP_ROLE_BYPASSRLS: false
APP_PATH_TENANT_BINDING: PASS (أُعيد إثباته Gate 2)
ROUTE_LEVEL_DDL_BLOCKS_FOUND: ~14 معالجاً / 13 جدولاً (500 مباشر) + مجموعتان مبتلَعتان (C)
ROUTE_LEVEL_DDL_BLOCKS_SELECTED_FOR_BATCH: Batch A = 10 مواضع (obgyn, referrals×2, medical_reports×3, cash_drawer, visit_lifecycle×3)
ROUTE_LEVEL_DDL_BLOCKS_REMOVED_OR_GUARDED: 10 (Batch A مُزالة بالكامل من الكود)
ROUTE_LEVEL_DDL_DEFERRED: Batch B (8 جداول: pathology/cssd/cme/infection_control/maintenance/insurance_policies/inventory/pharmacy_prescriptions) + Batch C (.catch ALTERs)
SQL_CANDIDATE_CREATED: YES (route_level_ddl_cleanup_candidate_{up,validate,down}.sql — يغطّي كل الجداول — لم يُنفَّذ)
TABLES_MISSING_IN_PROD: 13 (obgyn_pregnancies, obgyn_deliveries, referrals, medical_reports, cash_drawer, visit_lifecycle, pathology_specimens, cssd_batches, cme_events, infection_control_reports, maintenance_orders, inventory, pharmacy_prescriptions)
TABLES_EXISTING_IN_PROD (route-level): insurance_policies, pharmacy_prescriptions_queue
CODE_CHANGED: YES (namaweb server.js: +9/-110)
CODE_DEPLOYED: NO
PM2_RESTARTED: NO
DDL_EXECUTED: NO
DATA_CHANGED: NO
GRANT_EXECUTED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
AUDIT_READER_GRANTED_TO_APP: NO
STATIC_TEST_RESULT: PASS (node --check OK ؛ Batch A route DDL = 0 ؛ binding+wrapper محفوظان ؛ health route سليم ؛ diff = server.js فقط ؛ WS نظيف)
HEALTH_SMOKE: PASS (التطبيق الجاري لم يُمَس: health 200، /=200، /login=200، /api/patients=401)
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: APPROVE_ROUTE_LEVEL_DDL_REFACTOR_DEPLOY
```

## النشر المطلوب لاحقاً (بموافقة)
`APPROVE_ROUTE_LEVEL_DDL_REFACTOR_DEPLOY` =
1. تشغيل `docs/sql/route_level_ddl_cleanup_candidate_up.sql` بدور **superuser** خارج-النطاق (ينشئ الـ13 جدولاً المفقودة + يضيف الأعمدة) — backup + validate أولاً.
2. نشر patch الكود (إزالة Batch A) + restart محكوم.
3. تحقق: مسارات Batch A تعمل تحت nama_medical_app (لا 42501 ولا 42P01).
4. ثم مرشّح متابعة لـ**Batch B + C** (نفس النمط).

## صيغة الإغلاق
```text
STATUS: ROUTE_LEVEL_DDL_BATCH_A_REMOVED_CODE_ONLY + SQL_CANDIDATE_READY (NOT DEPLOYED)
SCOPE: post-deploy monitoring + Batch A route-DDL removal + SQL candidate (all tables)
PRODUCTION_READY: PARTIAL (RLS حيّ ومُثبَت ؛ مرشّح المسارات جاهز غير منشور ؛ Batch B+C لاحقاً)
P0_OPEN: NO
P1_OPEN: YES (نشر Batch A + migration ؛ ثم Batch B+C)
GIT_COMMITTED: YES (namaweb server.js + parent docs/sql/memory)
GIT_PUSHED: YES (بلا force)
NEXT_RECOMMENDED_PHASE: APPROVE_ROUTE_LEVEL_DDL_REFACTOR_DEPLOY
```

تم اكتمال مراقبة ما بعد تفعيل الدور المحدود وتجهيز مرشح إزالة DDL داخل المسارات بدون نشر إنتاجي
