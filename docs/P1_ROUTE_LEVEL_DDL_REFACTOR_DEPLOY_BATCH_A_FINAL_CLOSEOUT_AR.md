# P1 — نشر Batch A لإزالة DDL المسارات تحت الدور المقيَّد — إغلاق نهائي (مُنفَّذ)

> المرحلة: `P1_ROUTE_LEVEL_DDL_REFACTOR_DEPLOY_BATCH_A` | التاريخ: 2026-06-21 | نشر محكوم بموافقة محدودة.
> المسار: توقّف عند Gate 1 (المرشّح الأصلي بلا RLS) ⇒ جُهِّز بديل آمن RLS ⇒ **وافق المالك «اعتمد البديل الآمن + انشر»** ⇒ نُفِّذ بنجاح.

## التسلسل المُنفَّذ
1. **Gate 1 (توقّف ثم تصحيح)**: المرشّح الأصلي `route_level_ddl_cleanup_candidate_up.sql` كان ينشئ جداول PHI بلا RLS ⇒ أوقفته. جُهِّز `route_level_ddl_batch_a_rls_safe_candidate_{up,validate,down}.sql`. وافق المالك.
2. **Gate 2 (نسخة + تمرين)**: pg_dump schema-only (13107 سطر) + لقطات (149 جدول/122 سياسة/120 FORCE). تمرين على قاعدة معزولة `nama_route_ddl_rehearsal`: 6/6 جداول، 5/5 FORCE+policy+DEFAULT، cash_drawer بلا RLS، INSERT يُختَم tenant_id=1 ⇒ PASS، ثم أُسقطت القاعدة (لا تسرّب).
3. **Gate 3 (تنفيذ على الإنتاج)**: `route_level_ddl_batch_a_rls_safe_candidate_up.sql` بدور postgres، atomic ⇒ committed.
4. **Gate 4 (تحقق)**: 6/6 جداول؛ 5/5 FORCE RLS + سياسات + tenant_id DEFAULT؛ cash_drawer FORCE=false؛ 0 صفوف؛ nama_medical_app super=false/bypassrls=false؛ FORCE-RLS 120→**125**. PASS.
5. **Gate 5 (نشر الكود)**: `pm2 restart` يحمّل namaweb **bf5497c** (إزالة DDL المسارات) ⇒ online بلا crash-loop، health 6/6، /=200، /login=200، /api/patients=401، سجلات نظيفة.
6. **Gate 6 (تحقق المسارات)**: المسارات الستة → **401** (محمية، قابلة للوصول، بلا 500/DDL crash). DB-layer تحت الربط (ctx=1): الجداول الستة SELECT بلا **42501/42P01**. PASS.
7. **Gate 7 (الربط + العزل)**: binding(patients) ctx1=3/999=0/no-ctx=0 PASS؛ isolation(referrals الجديد): INSERT مختوم tenant_id=1، ctx1=1، ctx999=0، 0 متبقٍّ بعد ROLLBACK ⇒ العزل يعمل على الجدول الجديد. PASS.
8. **Gate 8**: accounting OFF، audit-reader غير ممنوح، لا GRANT.

## الحقول
```text
FINAL_STATUS: PRODUCTION_DEPLOYED_PASS_BATCH_A
SELECTED_PHASE: P1_ROUTE_LEVEL_DDL_REFACTOR_DEPLOY_BATCH_A
DB_ROLE_CURRENT: nama_medical_app (super=false, bypassrls=false)
APP_PATH_TENANT_BINDING: PASS (ctx1=3, ctx999=0, no-ctx=0)
BATCH_A_TABLES_CREATED: 6 (obgyn_pregnancies, obgyn_deliveries, referrals, medical_reports, visit_lifecycle, cash_drawer) [تصحيح: «13» كان A+B]
SQL_EXECUTED: YES_LIMITED_BATCH_A_SCHEMA (النسخة الآمنة RLS؛ لا المرشّح الأصلي)
SQL_VALIDATE_RESULT: PASS (rehearsal + prod validate)
RLS_ADDED: 5 جداول (obgyn×2, referrals, medical_reports, visit_lifecycle) ENABLE+FORCE+policy+tenant_id DEFAULT؛ cash_drawer user-scoped (بلا RLS)
FORCE_RLS_TABLE_COUNT: 120 → 125
CODE_DEPLOYED: YES (namaweb bf5497c عبر pm2 restart)
PM2_RESTARTED: YES_CONTROLLED
NO_42501: YES
NO_42P01: YES
NO_SCHEMA_PERMISSION_ERRORS: YES
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
AUDIT_READER_GRANTED_TO_APP: NO
DATA_SEEDED: NO
DATA_CHANGED: NO (التمرين/العزل كانا transaction ROLLBACK؛ patients=3 بلا تغيير)
GRANT_EXECUTED: NO
ENV_CHANGED: NO (الدور كما هو nama_medical_app؛ لا تغيير .env هذه المرحلة)
ROLLBACK_READY: YES (route_level_ddl_batch_a_rls_safe_candidate_down.sql يُسقط الجداول الـ6 الفارغة + schema backup)
ROLLBACK_USED: NO
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: POST_DEPLOY_MONITORING_THEN_ROUTE_DDL_BATCH_B_C
```

## ملاحظات
- **انحراف موافَق عليه**: نُفِّذت النسخة الآمنة RLS (لا المرشّح الأصلي) بعد توقّف Gate 1 وموافقة المالك — لتفادي إنشاء جداول PHI بلا عزل.
- **visit_lifecycle**: أُضيف له tenant_id + RLS (لم يكن له عزل أصلاً) — تحسين عزل يعمل عبر الربط بلا تعديل كود.
- **متبقٍّ**: Batch B (8 جداول: pathology/cssd/cme/infection_control/maintenance/insurance_policies/inventory/pharmacy_prescriptions — DDLها ما زال في الكود) + Batch C (.catch ALTERs) ⇒ مرشّح متابعة منفصل بنفس النمط الآمن RLS.

## صيغة الإغلاق
```text
STATUS: ROUTE_DDL_BATCH_A_DEPLOYED_WITH_RLS (6 tables created, 5 FORCE-RLS; code bf5497c live; routes no 42501/42P01)
SCOPE: Batch A only (6 tables) — SQL (RLS-safe) executed + code deployed
PRODUCTION_READY: PARTIAL (Batch A حيّ ومعزول ؛ يبقى Batch B+C)
P0_OPEN: NO | P1_OPEN: YES (Batch B+C route-DDL)
GIT_COMMITTED: YES | GIT_PUSHED: YES (بلا force)
NEXT_RECOMMENDED_PHASE: POST_DEPLOY_MONITORING_THEN_ROUTE_DDL_BATCH_B_C
```

تم اكتمال نشر Batch A لإزالة DDL داخل المسارات تحت الدور المحدود
