# P1 — إغلاق النشر المحكوم لإصلاح Refund IDOR (Controlled Deploy Closeout)

> المرحلة: `P1_REFUND_IDOR_CONTROLLED_PRODUCTION_DEPLOY` — البوابة 7 | التاريخ: 2026-06-21 | single-box.

## ما تم
نُشِر `server.js` (namaweb 8f012a0، إصلاح حارس tenant في refund) عبر بدء `nama-app` على PM2 (Redis متاح ⇒ بلا crash-loop). smoke أخضر، ولم يتغيّر مخطط/بيانات. لم يُلمَس DDL/Data/flag/RLS-role.

## الأدلة
- **PM2**: `nama-app online`, restarts=0, :3000 OPEN بعد ~9s, `pm2 save` تم.
- **health smoke**: `GET /` = 200 ، `GET /api/health` = 200 ، `GET /api/invoices` (بلا جلسة) = **401** ، `POST /api/invoices/1/refund` (بلا جلسة) = **401**.
- **IDOR على الملف المنشور**: `WHERE id=$1 AND tenant_id=$2` موجود؛ النمط المعرّض (id فقط) = **0**.
- **لا تغيير DB**: لقطة قبل/بعد بدء التطبيق متطابقة → tables=149, FORCE=115, CoA=30, journal=0, invoices=3 (bootstrap الإقلاع idempotent IF NOT EXISTS = no-op على مخطط مكتمل؛ seeders الإنتاج مُتخطّاة per ef1acf9).
- **HTTP→HTTPS 301**: غير منطبق محلياً (يتم في Nginx بالإنتاج الحقيقي) — N/A single-box.

## الحقول
```text
FINAL_STATUS: PRODUCTION_DEPLOYED_PASS
USER_VISIBLE_ON_WEBSITE: YES (التطبيق يخدم على :3000 بالكود المُصحَّح)
PRODUCTION_DEPLOYED: YES (single-box: PM2 nama-app online بالإصدار 8f012a0)
BACKUP_PATH: (محلي خارج المستودع) nama_deploy_backups/server.js.pre-deploy-ef1acf9.bak (7421 سطر)
FILES_DEPLOYED: namaweb/server.js (8f012a0) [+ cross_tenant_refund_idor_test.js مرافق في الريبو، ليس runtime مطلوب]
COMMIT_DEPLOYED: namaweb 8f012a0 (parent gitlink 7cbc44d)
PM2_STATUS: online (restarts=0, saved)
HEALTH_SMOKE: PASS (/=200, /api/health=200, protected=401)
IDOR_DEPLOYED: YES
IDOR_SMOKE_RESULT: PASS (refund requires auth; tenant-scoped SELECT present; vulnerable pattern=0; no live refund created)
DDL_EXECUTED: NO
DATA_CHANGED: NO (before==after snapshot)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_CREATED: NO
RLS_RUNTIME_ROLE_STILL_BYPASSED: YES (app يتصل postgres/superuser — مخطر متبقٍ، مرحلة منفصلة)
ROLLBACK_READY: YES (backup + `git -C namaweb checkout ef1acf9 -- server.js` أو revert 8f012a0 + pm2 restart؛ code-only)
ROLLBACK_USED: NO
SECRETS_PRINTED: NO
UTF8_AUDIT: PASS
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: P0_RLS_RUNTIME_ROLE_ENFORCEMENT_RESTORE
```

## معيار PASS — مُستوفى
الملف المنشور فيه tenant guard ✅ · PM2 online ✅ · health/smoke PASS ✅ · لا DDL/data/journal ✅ · flag OFF ✅ · rollback جاهز ✅ · RLS role bypass موثّق كمخطر متبقٍ ✅ · UTF-8 PASS ✅ · push بلا force ✅.

## مخطر متبقٍ (صريح)
`RLS_RUNTIME_ROLE_STILL_BYPASSED: YES`. الـ115 FORCE policy لن تَنفُذ حتى يُربط التطبيق بدور `nama_medical_app`. العزل الحالي = فلاتر التطبيق (وقد قُوّيت في refund). المرحلة التالية الإلزامية: `P0_RLS_RUNTIME_ROLE_ENFORCEMENT_RESTORE`.

`REFUND_IDOR_CONTROLLED_DEPLOY_FINAL_CLOSEOUT_COMPLETE`
