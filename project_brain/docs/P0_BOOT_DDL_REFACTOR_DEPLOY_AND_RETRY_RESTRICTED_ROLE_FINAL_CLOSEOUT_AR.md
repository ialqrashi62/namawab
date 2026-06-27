# P0 — نشر refactor الإقلاع + تشغيل التطبيق بدور nama_medical_app + إثبات RLS — إغلاق نهائي

> المرحلة: `P0_BOOT_DDL_REFACTOR_DEPLOY_AND_RETRY_RESTRICTED_ROLE` | التاريخ: 2026-06-21 | نشر محكوم بموافقة محدودة.
> **النتيجة التاريخية**: لأول مرة، RLS **مُنفَّذ فعلياً في وقت التشغيل** — التطبيق يعمل كدور `nama_medical_app` غير-superuser، وإثبات ربط `app.tenant_id` عبر مسار التطبيق نجح. (في Phase 161 تبيّن أن التبديل لم يكن حيّاً قط؛ الآن أصبح حيّاً ومُثبَتاً.)

## مسار البوابات
- **Gate 2**: إعادة تشغيل تحت postgres لتحميل d0f1f70 ⇒ online، health 200، / و /login = 200، رسائل التخطّي ظهرت، بلا أخطاء DDL/seed.
- **Gate 3**: تبديل `.env` إلى nama_medical_app (السر من ملف آمن، بلا طباعة) ⇒ اتصال مُتحقَّق: super=false, bypassrls=false.
- **Gate 4**: إعادة تشغيل محكومة تحت الدور المقيَّد ⇒ online بلا crash-loop؛ health 200؛ / و /login = 200؛ /api/patients بلا جلسة = 401؛ POST /api/auth/login (وهمي) = 401 "Invalid credentials" (الاستعلام نجح)؛ **pg_stat_activity أكّد أن التطبيق يتصل كـ nama_medical_app**.
- **Gate 5 (إثبات الربط عبر مسار التطبيق)**: harness يستخدم `db_postgres.js` runWithTenant + غلاف pool.query (نفس آلية الـmiddleware) كـ nama_medical_app ⇒ ctx=1: app.tenant_id=1، patients=3 ؛ ctx=999: 0 ؛ بلا سياق: 0. **PASS**.
- **Gate 6 (smoke كتابة، transaction ROLLBACK، صفر صفوف دائمة)**: إدراج بلا tenant_id @ctx=1 ⇒ مختوم tenant_id=1 ؛ تزوير 999 ⇒ 42501 ؛ بلا سياق ⇒ 42501 (fail-closed) ؛ audit_trail @ctx=1 ⇒ مختوم 1 ؛ صفر صفوف WS_ متبقية (تأكيد مستقل كـ postgres).
- **Gate 7 (تصنيف فقط)**: ثبت أن `CREATE/ALTER ... IF NOT EXISTS` يرمي 42501 تحت الدور المقيَّد حتى لكائنات موجودة ⇒ DDL مستوى المسارات متبقٍّ (متابعة منفصلة).
- **Gate 8**: accounting OFF (لا journal_entries)، nama_medical_app ليس عضواً في nama_audit_reader، لا GRANT/DDL.
- **Gate 9**: بعد flush + نشاط جديد، سجلات التشغيل **نظيفة** (لا permission/RLS/42501/Failed)؛ restarts=34 ثابتة، uptime يتصاعد، mem ~85mb.

## الحقول
```text
FINAL_STATUS: PRODUCTION_DEPLOYED_PASS
SELECTED_PHASE: P0_BOOT_DDL_REFACTOR_DEPLOY_AND_RETRY_RESTRICTED_ROLE
USER_VISIBLE_ON_WEBSITE: YES (الموقع يخدم / و /login = 200 ؛ مع تحفّظ: مسارات ثانوية بها DDL داخلي قد تُرجع 500)
NAMAWEB_HEAD: d0f1f70 (بلا تغيير كود هذه المرحلة — نشر فقط)
PARENT_HEAD: (مُقدَّم بكوميت هذه البوابة — closeout + memory)
DB_ROLE_BEFORE: postgres
DB_ROLE_AFTER: nama_medical_app
APP_ROLE_SUPERUSER: false
APP_ROLE_BYPASSRLS: false
BOOT_REFACTOR_DEPLOYED: YES
PM2_RESTARTED: YES_CONTROLLED
STARTUP_DDL_ERRORS_FOUND: NO
STARTUP_SEED_ERRORS_FOUND: NO
HEALTH_SMOKE: PASS (health 5/5 ؛ / و /login 200 ؛ /api/patients بلا جلسة 401)
APP_PATH_TENANT_BINDING: PASS
PATIENTS_VISIBLE_THROUGH_APP_PATH: 3
TENANT_999_VISIBLE_THROUGH_APP_PATH: 0
NO_CONTEXT_FAIL_CLOSED: PASS
WRITE_SAMPLE_RESULT: PASS (stamp=1 ؛ forge=42501 ؛ no-ctx=42501 ؛ صفر صفوف دائمة)
AUDIT_TRAIL_TENANT_STAMPING: PASS (tenant_id=1)
ROUTE_LEVEL_DDL_REMAINING: YES
ROUTES_AT_RISK_UNDER_RESTRICTED_ROLE: obgyn/stats, referrals, medical_reports, cash_drawer, visit_lifecycle, inventory(GET), pathology, cssd, cme, infection_control, maintenance_orders, insurance_policies, pharmacy_prescriptions (CREATE/ALTER غير مُلتقَط داخل المعالج ⇒ 500 عند الطلب). مسارات بـ.catch (prescriptions, pharmacy/queue) تتحمّل.
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
AUDIT_READER_GRANTED_TO_APP: NO
DDL_EXECUTED: NO
DATA_CHANGED: NO (smoke كان transaction ROLLBACK ؛ patients=3 قبل/بعد)
GRANT_EXECUTED: NO
ENV_CHANGED: YES (DB_USER/DB_PASSWORD → nama_medical_app ؛ التبديل المُصرّح به فقط)
ROLLBACK_READY: YES (نسخة .env.postgres محفوظة خارج المستودع + pm2 dump)
ROLLBACK_USED: NO
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: POST_DEPLOY_MONITORING_THEN_ROUTE_LEVEL_DDL_REMOVAL_OR_BATCH1
```

## متبقٍّ صريح (لا يُخفى)
1. **DDL مستوى المسارات** (`P1_ROUTE_LEVEL_DDL_REMOVAL_FOR_RESTRICTED_ROLE`): المسارات الثانوية المذكورة أعلاه تحاول `CREATE/ALTER TABLE` عند الطلب وستُرجع 500 تحت الدور المقيَّد. الجداول الأساسية (patients/auth/invoices) بلا DDL في المعالج ⇒ غير متأثرة. المتابعة: نقل CREATE/ALTER خارج المعالجات (الجداول موجودة في الإنتاج).
2. الإقلاع لا ينفّذ DDL/seed (محروس)؛ لكن «عمل كل المسارات» يحتاج إزالة DDL المسارات.

## التراجع (جاهز، لم يُستخدم)
`restore .env.postgres.bak → namaweb/.env ؛ pm2 restart nama-app --update-env ؛ verify health 200` (نسخ خارج المستودع).

## صيغة الإغلاق
```text
STATUS: RESTRICTED_ROLE_LIVE_RLS_ENFORCED_AT_RUNTIME (deployed, app-path binding proven)
SCOPE: deploy boot-refactor + switch to nama_medical_app + prove app.tenant_id + write smoke
PRODUCTION_READY: PARTIAL (عزل RLS حيّ ومُثبَت على الجداول الأساسية ؛ يبقى P1 إزالة DDL المسارات)
P0_OPEN: NO (هدف المرحلة — RLS حيّ بدور مقيَّد — تحقّق)
P1_OPEN: YES (route-level DDL removal)
GIT_COMMITTED: YES (closeout + memory ؛ namaweb d0f1f70 بلا تغيير)
GIT_PUSHED: YES (بلا force)
NEXT_RECOMMENDED_PHASE: P1_ROUTE_LEVEL_DDL_REMOVAL_FOR_RESTRICTED_ROLE
```

تم اكتمال نشر refactor الإقلاع واستعادة تشغيل التطبيق بدور nama_medical_app مع إثبات app.tenant_id عبر مسار التطبيق
