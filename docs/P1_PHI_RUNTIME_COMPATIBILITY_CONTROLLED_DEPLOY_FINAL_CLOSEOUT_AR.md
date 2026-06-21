# P1 — إغلاق النشر المحكوم لتوافق Runtime لطبقة PHI Class A (Final Closeout)

> المرحلة: `P1_PHI_RUNTIME_COMPATIBILITY_CONTROLLED_DEPLOY` | تفويض: `APPROVE_DEPLOY_PHI_RUNTIME_COMPATIBILITY 6ecbf4a` | التاريخ: 2026-06-21.

## ملخص
نُشِر كود توافق Runtime لطبقة PHI Class A (ختم `tenant_id/facility_id` لمسارَي blood-bank) على الإنتاج single-box عبر إعادة تشغيل PM2: namaweb **082c07b → 6ecbf4a**. لا DDL، لا تغيير بيانات، لا تبديل دور، لا محاسبة. كل الفحوص خضراء.

## أدلة البوابات
- **Gate 0**: متزامن (parent 2048a8c، namaweb 6ecbf4a)، القرص = 6ecbf4a، running=082c07b، online/200، flag OFF، RLS_FORCE=120، journal=0، role postgres.
- **Gate 1**: backup هدف التراجع 082c07b (`server.js.082c07b.bak`، 7473 سطراً، 0 ختم = صحيح) + مرجع 6ecbf4a، خارج المستودع.
- **Gate 2/3**: الفرق محصور **حصراً** في مسارَي blood-bank (units/donors POST) — `requireTenantScope` + أعمدة tenant_id/facility_id؛ لا تغييرات خارج النطاق. `node --check` = OK.
- **Gate 4**: `pm2 restart` → online، restarts 1→2 (مستقر، لا crash-loop)، «REDIS SUCCESS» + «Nama Medical Web is running»، `pm2 save`. running الآن = 6ecbf4a.
- **Gate 5 smoke**: `/`=200، `/api/health`=200، `/login`=200، patients/invoices بلا جلسة=401، **POST blood-bank/units & donors بلا جلسة=401**. (لم يُنشأ donor/unit حيّ.)
- **Gate 6**: تحقق ثابت للـruntime المنشور (server.js على القرص = 6ecbf4a = الجاري): `phi_class_a_runtime_stamping_test.js` **18/18 PASS**. invariants: RLS_FORCE=120، journal=0، blood_bank_units.tenant_id موجود، audit_trail=44 (بلا تغيير)، DB_USER=postgres، logAudit runtime بلا تغيير.

## الحقول
```text
FINAL_STATUS: PRODUCTION_DEPLOYED_PASS
SELECTED_PHASE: P1_PHI_RUNTIME_COMPATIBILITY_CONTROLLED_DEPLOY
USER_VISIBLE_ON_WEBSITE: YES (التطبيق يخدم على :3000 بالكود 6ecbf4a)
PRODUCTION_DEPLOYED: YES
LIVE_COMMIT_BEFORE: namaweb 082c07b
COMMIT_DEPLOYED: namaweb 6ecbf4a
FILES_DEPLOYED: namaweb/server.js (فقط POST /api/blood-bank/units و POST /api/blood-bank/donors)
DDL_EXECUTED: NO
DATA_CHANGED: NO
RUNTIME_CODE_CHANGED: YES
PM2_STATUS: online (restarts=2, مستقر, saved)
HEALTH_SMOKE: PASS
PHI_RUNTIME_COMPATIBILITY_DEPLOYED: YES
BLOOD_BANK_UNITS_STAMPING_LIVE: YES
BLOOD_BANK_DONORS_STAMPING_LIVE: YES
AUDIT_TRAIL_DECISION: مؤجّل — سجل نظامي؛ يحتاج سياسة سماحية/نظامية أو دور كاتب-تدقيق قبل تبديل الدور؛ runtime logAudit بلا تغيير
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_CREATED: NO
RLS_CHANGED: NO
RLS_RUNTIME_ENFORCEMENT: NOT_YET (app=postgres يتجاوز الـ120 سياسة)
DB_ROLE_BEFORE: postgres
DB_ROLE_AFTER: postgres
ROLLBACK_READY: YES (server.js.082c07b.bak + git checkout 082c07b + pm2 restart)
ROLLBACK_USED: NO
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: P1_AUDIT_TRAIL_RLS_POLICY_COMPATIBILITY_PRECHECK_THEN_SECRET_READY_EXECUTE_SWITCH
```

## معيار النجاح — مُستوفى
backup جاهز ✅ · الفرق محصور في blood-bank ✅ · syntax OK ✅ · pm2 online مستقر ✅ · smoke PASS ✅ · الختم حيّ (units/donors) ✅ · audit_trail runtime بلا تغيير ✅ · DDL/data/role/accounting بلا تغيير ✅ · RLS runtime موثّق NOT_YET ✅ · rollback ready ✅ · لا أسرار ✅ · push بلا force ✅.

## المتبقّي قبل تبديل الدور (شرطان)
1. **قرار سياسة audit_trail** (`P1_AUDIT_TRAIL_RLS_POLICY_COMPATIBILITY_PRECHECK`): سياسة سماحية/نظامية أو دور كاتب-تدقيق، وإلا توقّف تسجيل التدقيق بصمت بعد التبديل.
2. **precheck ضبط `app.tenant_id`** لكل طلب في نطاق الاتصال/المعاملة (db_postgres.js/server.js) — وإلا تعطّل وظيفي آمن بعد التبديل.
ثم: `SECRET_READY_EXECUTE_SWITCH` (الجذر) مع توفير سر nama_medical_app خارج الشات.

`PHI_RUNTIME_COMPATIBILITY_CONTROLLED_DEPLOY_FINAL_CLOSEOUT_COMPLETE`
