# Phase A1 — إغلاق النشر الإنتاجي (EMR Lock/Signature)

> 2026-06-22 | نُفِّذ على الإنتاج بموافقة صريحة. backend منشور ومُتحقَّق؛ UI مؤجّل لحين Browser E2E. المحاسبة OFF.

## الحقول
```text
FINAL_STATUS: PHASE_A1_EMR_LOCK_SIGNATURE_DEPLOYED_AND_VERIFIED (backend)؛ UI deferred pending Browser E2E
BACKUP_CREATED: YES
BACKUP_PATH: ~/nama_deploy_backups/emr_lock_20260622/ (before_snapshot.json + up/validate/down.sql)
DDL_EXECUTED: YES (additive: 6 lock cols × 5 جداول + جدول emr_amendments FORCE RLS)
DDL_VALIDATE: PASS (6 أعمدة/جدول؛ emr_amendments force=true policy=1 tenant_id=Y)
DATA_CHANGED: NO (الجداول كانت فارغة؛ لا backfill؛ تحقّق live في ROLLBACK txn بلا صفوف دائمة)
CODE_DEPLOYED: YES (namaweb main bc24a47→8023aeb؛ pm2 restart)
PM2_RESTARTED: YES (سبب: تحميل server.js الجديد — جزء من النشر)
TABLES_AFFECTED: medical_records, nursing_assessments, medical_reports, medical_certificates, surgery_anesthesia_records (+ emr_amendments جديد)
APIS_AFFECTED: POST /api/medical-records/:id/sign، POST /:id/amend، GET /:id/amendments (role doctor/nursing/admin)
UI_AFFECTED: DEFERRED (لم يُنشر — يحتاج Browser E2E بحساب اختبار للتحقّق قبل لمس شاشة الطبيب)
TESTS_RUN: static guard 10/10؛ live prod-DB harness (ROLLBACK) PASS
TESTS_PASS: YES
RBAC_STATUS: PASS (unauth sign/amend=401؛ role-guarded doctor/nursing/admin)
RLS_STATUS: PASS (emr_amendments FORCE+policy؛ FORCE_RLS 148→149)
TENANT_ISOLATION_STATUS: PASS (ctx1 stamped؛ ctx999=0؛ forge 42501؛ patients 3/0)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
HEALTH_STATUS: PASS (local 5/5، domain 200)
ROLLBACK_READY: YES (down.sql؛ الجداول فارغة؛ + git checkout للكود)
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
GIT_COMMIT: namaweb 8023aeb (feat) + parent (gitlink+docs)
GIT_PUSH: FF (namaweb origin/main؛ parent origin/master)
NEXT_RECOMMENDED_ACTION: PROVIDE_TEST_ACCOUNT_FOR_BROWSER_E2E ثم نشر UI القفل/التوقيع (زر Sign + badge + amendment modal) والتحقّق الحيّ؛ ثم Phase A2 (MFA).
```

## الإثبات الحيّ (prod DB، ROLLBACK، role nama_medical_app)
created=draft · sign rowCount=1 · **edit-while-locked rowCount=0 (مرفوض)** · amend stamped tenant=1 · ctx999=0 · forge→42501.

## ملاحظة النطاق (شفافية)
- **backend القفل/التوقيع منشور ومُنفَّذ فعلياً** (الإنفاذ على مستوى API/DB — القفل يعمل بغضّ النظر عن الواجهة).
- **UI مؤجّل عمداً**: نشر واجهة شاشة سريرية غير مُتحقَّقة بدون Browser E2E (لا حساب اختبار) يخاطر بكسر شاشة الطبيب. يُنشر بعد توفّر حساب E2E.
- لم تُلمس صفحات beta ولا فرع r17-parallel-wip-preserve.

تم تنفيذ وتحقق EMR Lock/Signature كأول بند P0 في Phase A دون تفعيل المحاسبة أو كسر الاستقرار
