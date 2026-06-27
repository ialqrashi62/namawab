# مراقبة P0 system_users + نشر Batch B/C لإزالة DDL المسارات — إغلاق نهائي (مُنشور)

> المرحلة: `POST_P0_SYSTEM_USERS_GUARD_MONITORING_THEN_ROUTE_DDL_BATCH_B_C_DEPLOY` | 2026-06-21 | نشر محكوم. بلا data/GRANT/.env/accounting.

## ملخص
- **مراقبة P0 system_users**: مستقرة بعد النشر — health 5/5، smoke أخضر، PUT/settings/users بلا جلسة=401، سجلات نظيفة (لا 42501/42P01/تصعيد).
- **Batch B/C**: نُفِّذ SQL آمن RLS على الإنتاج (8 جداول Batch B بـtenant_id+FORCE RLS+policy+DEFAULT؛ أعمدة pharmacy_prescriptions_queue) ⇒ **FORCE_RLS 125→133**؛ ثم أُزيل DDL المسارات من الكود ونُشر.

## التسلسل
1. **Gate 0** مراقبة P0: PASS (نظيف).
2. **Gate 1** مراجعة SQL: RLS-safe (كل tenant table بـtenant_id+FORCE+policy+DEFAULT؛ لا seed/backfill/GRANT — مؤكَّد بالمطابقة).
3. **Gate 2** نسخة احتياطية (schema dump 13632 سطر + لقطات) + **إعادة rehearsal على قاعدة معزولة: PASS** (8/8 tables/force/policies/defaults، Batch C 8/8 cols، stamp=1، أُسقطت).
4. **Gate 3** تنفيذ batch_b + batch_c up.sql على الإنتاج (postgres، atomic) ⇒ OK.
5. **Gate 4** تحقق: 8/8 tables FORCE+policy+DEFAULT، Batch C 8/8 cols، 0 صفوف، role غير-super، **FORCE_RLS=133**. PASS.
6. **Gate 5** إزالة كود Batch B/C (server.js +22/-52؛ pathology/cssd/cme/infection_control/maintenance/insurance/inventory/pharmacy_prescriptions + pharmacy_queue ALTERs) ⇒ commit namaweb `4d51031→9becc9e` (FF) ⇒ pm2 restart ⇒ online، health 6/6، smoke أخضر، Redis PONG.
7. **Gate 6** تحقق المسارات: 8 مسارات → **401** (لا 500)؛ DB-layer تحت الربط: 8 جداول بلا **42501/42P01**.
8. **Gate 7** core RLS: binding PASS (ctx1=3/999=0/no-ctx=0)، FORCE_RLS=133، system_users guard PUT=401.

## الحقول
```text
FINAL_STATUS: PRODUCTION_DEPLOYED_PASS_BATCH_B_C
P0_SYSTEM_USERS_GUARD_MONITORING: PASS
DB_ROLE_CURRENT: nama_medical_app
APP_ROLE_SUPERUSER: false
APP_ROLE_BYPASSRLS: false
APP_PATH_TENANT_BINDING: PASS
SQL_EXECUTED: YES_LIMITED_BATCH_B_C_RLS_SAFE
SQL_VALIDATE_RESULT: PASS
FORCE_RLS_COUNT: 125 -> 133
CODE_DEPLOYED: YES (namaweb 9becc9e)
PM2_RESTARTED: YES_CONTROLLED
NO_42501: YES
NO_42P01: YES
NO_SCHEMA_PERMISSION_ERRORS: YES
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
AUDIT_READER_GRANTED_TO_APP: NO
DATA_SEEDED: NO
DATA_CHANGED: NO
GRANT_EXECUTED: NO
ENV_CHANGED: NO
ROLLBACK_READY: YES (git -C namaweb checkout 4d51031 -- server.js && pm2 restart؛ + down.sql + schema dump)
ROLLBACK_USED: NO
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: POST_DEPLOY_MONITORING_THEN_14_TABLE_RLS_OR_API_RBAC
```

## متبقٍّ (بوابات موافقة)
- **14 جدول tenant-sensitive بلا RLS** (finance_*, discount_rules, insurance_companies/contracts, employees[رواتب], branches, departments, form_templates, cme_activities/registrations, cssd_*) ⇒ يحتاج tenant_id+RLS + backfill (DATA_CHANGE_APPROVAL).
- API/RBAC defense-in-depth (دفعات)؛ audit-reader GRANT. accounting OFF.

تم اكتمال مراقبة إصلاح P0 ونشر Batch B/C لإزالة DDL المتبقي تحت الدور المحدود
