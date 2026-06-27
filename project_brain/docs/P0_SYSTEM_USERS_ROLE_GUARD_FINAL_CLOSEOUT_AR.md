# P0 — حماية تعديل أدوار المستخدمين — إغلاق نهائي (مُنشور)

> المرحلة: `P0_SYSTEM_USERS_ROLE_GUARD_CODE_ONLY_DEPLOY` | 2026-06-21 | إصلاح كود + نشر محكوم. بلا DDL/DATA/GRANT/.env.

## ما أُصلح
`PUT /api/settings/users/:id` (server.js) كان `requireAuth` فقط ⇒ أي مستخدم مصادَق يغيّر role/permissions/is_active/password لأي مستخدم (ترقية ذاتية/اختطاف حساب). RLS لا يحميه (system_users بلا RLS؛ الخطر في الصلاحيات نفسها).

**الإصلاح**: الهوية من الجلسة فقط (لا body). غير-Admin يعدّل **سجلّه فقط** و**حقول profile الآمنة فقط** (display_name, speciality, password)؛ أي محاولة تغيير role/permissions/status/username/commission على نفسه ⇒ 403 + audit؛ تعديل مستخدم آخر ⇒ 403 + audit. Admin يحتفظ بالتحديث الكامل + حماية «آخر Admin نشط» (منع تنزيله/تعطيله).

## الاختبارات
- guard-logic harness (يطابق الكود المنشور): **6/6 PASS** — own-role→403، other-user→403، self permissions=*→403، safe self-profile→allow، full-object-no-change→allow (لا يكسر حفظ الملف المشروع)، admin→allow.
- HTTP: `PUT /api/settings/users/1` بلا جلسة ⇒ **401**.
- بعد النشر: health 6/6، /=200، /login=200، /api/patients=401، Redis PONG، binding PASS.
- ملاحظة: اختبار فروع الحارس بجلسة حيّة عبر المتصفح يحتاج حساب اختبار (غير متاح) ⇒ تحقّق عبر harness موثّق + 401 (لا ادّعاء browser E2E).

## الحقول
```text
FINAL_STATUS: PRODUCTION_DEPLOYED_PASS
SELECTED_PHASE: P0_SYSTEM_USERS_ROLE_GUARD_CODE_ONLY_DEPLOY
DB_ROLE_CURRENT: nama_medical_app
APP_ROLE_SUPERUSER: false
APP_ROLE_BYPASSRLS: false
APP_PATH_TENANT_BINDING: PASS (ctx1=3, ctx999=0, no-ctx=0)
RISK_FIXED: P0_SYSTEM_USERS_ROLE_GUARD
ROUTE_FIXED: PUT /api/settings/users/:id
DANGEROUS_FIELDS_GUARDED: role, permissions, is_active, username, commission_type, commission_value, password(للغير)
SELF_ESCALATION_BLOCKED: YES
CROSS_TENANT_BLOCKED: N/A (system_users جدول عالمي بلا tenant_id — لا يُفرَض دون DDL، خارج النطاق)
NORMAL_SAFE_UPDATE_PRESERVED: YES (display_name/speciality/password للذات)
CODE_CHANGED: YES (namaweb server.js: +48/-2)
CODE_DEPLOYED: YES (namaweb 4d51031 عبر pm2 restart)
PM2_RESTARTED: YES_CONTROLLED
DDL_EXECUTED: NO
DATA_CHANGED: NO
GRANT_EXECUTED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
AUDIT_READER_GRANTED_TO_APP: NO
HEALTH_SMOKE: PASS
SECURITY_TEST_RESULT: PASS (guard-logic 6/6 + 401؛ live E2E يحتاج حساب اختبار)
ROLLBACK_READY: YES (git -C namaweb checkout bf5497c -- server.js && pm2 restart؛ نسخة محفوظة خارج المستودع)
ROLLBACK_USED: NO
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: POST_DEPLOY_MONITORING_THEN_ROUTE_DDL_BATCH_B_C_DEPLOY
```

تم اكتمال إصلاح P0 لحماية تعديل أدوار المستخدمين ونشره بدون تغييرات قاعدة بيانات
