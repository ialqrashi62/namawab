# P1 — إغلاق تطبيق DDL المتبقّي لطبقة PHI Class A على الإنتاج (Final Closeout)

> المرحلة: `P1_PHI_CLASS_A_RESIDUAL_RLS_PRODUCTION_DDL_CONTROLLED_EXECUTION` | تفويض: `APPROVE_PHI_CLASS_A_DDL` | التاريخ: 2026-06-21.

## ملخص
طُبِّق مرشّح PHI Class A (المُثبَت في البروفة 17/17) على قاعدة الإنتاج `nama_medical_web` بشكل محكوم: تفعيل RLS+FORCE+policy على الجداول الخمسة، وإضافة `tenant_id/facility_id` additive للثلاثة الفارغة. **بلا تبديل دور، بلا نشر runtime، بلا محاسبة، بلا تغيير بيانات.** التحقق PASS، والإنفاذ مُثبَت على بيانات إنتاج حقيقية عبر `SET ROLE` (قراءة فقط).

## الحقول
```text
FINAL_STATUS: PRODUCTION_DDL_PASS_RUNTIME_ROLE_NOT_SWITCHED
SELECTED_PHASE: P1_PHI_CLASS_A_RESIDUAL_RLS_PRODUCTION_DDL_CONTROLLED_EXECUTION
USER_VISIBLE_ON_WEBSITE: PARTIAL (بُنى العزل حيّة في قاعدة الإنتاج؛ لا تغيّر سلوك واجهة للمستخدم بعد لأنّ التطبيق postgres يتجاوز RLS — الإنفاذ يبدأ بعد تبديل الدور)
PRODUCTION_DEPLOYED: NO_RUNTIME_DEPLOY (تغيير قاعدة بيانات فقط؛ لا كود)
DDL_EXECUTED: YES
DDL_FILES_EXECUTED: phi_class_a_residual_rls_candidate_up.sql (+ validate.sql قراءة فقط)
DDL_VALIDATE_RESULT: PASS (7/7 checks = 0 bad_rows)
DATA_CHANGED: NO_MANUAL_DATA_CHANGE
TARGET_TABLES: portal_users, audit_trail, packages, blood_bank_donors, blood_bank_units
ROW_COUNTS_BEFORE: portal_users=0, audit_trail=44, packages=0, blood_bank_donors=0, blood_bank_units=0
ROW_COUNTS_AFTER:  portal_users=0, audit_trail=44, packages=0, blood_bank_donors=0, blood_bank_units=0 (دون تغيير)
RLS_FORCE_APPLIED: YES (5/5)
POLICIES_APPLIED: YES (5/5 ، سياسة واحدة لكل جدول: rls_<t>_tenant_isolation)
TENANT_ID_COLUMNS_ADDED: 3 (packages, blood_bank_donors, blood_bank_units ؛ + facility_id additive لنفس الثلاثة)
DB_ROLE_BEFORE: postgres
DB_ROLE_AFTER: postgres
RLS_RUNTIME_ENFORCEMENT: NOT_YET (التطبيق postgres يتجاوز؛ الإنفاذ مُثبَت enforceable عبر SET ROLE على بيانات حقيقية)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_CREATED: NO
PM2_STATUS: online (restarts=1 ، بلا restart — DDL مستقل والتطبيق لم يتأثر)
HEALTH_SMOKE: PASS (/=200، /api/health=200، protected=401×3 ، postgres يكتب audit_trail تحت FORCE RLS = OK)
BACKUP_PATH: ~/nama_deploy_backups/phi_class_a_20260621/{phi_class_a_5tables.sql (pg_dump), phi_class_a_snapshot.json}
ENFORCEMENT_VERIFICATION: PASS (SET ROLE nama_medical_app على audit_trail: tenant1=44, tenant999=0, no-context=0)
APP_UNAFFECTED_EVIDENCE: postgres INSERT into audit_trail under FORCE RLS = OK (bypass) ؛ invoice_cols=25 ؛ journal=0
ROLLBACK_READY: YES (down.sql + pg_dump restore + snapshot)
ROLLBACK_USED: NO
SECRETS_PRINTED: NO
UTF8_AUDIT: PASS
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: P1_PHI_TENANT_STAMPING_RUNTIME_COMPATIBILITY_OR_SECRET_READY_EXECUTE_SWITCH
```

## معيار النجاح — مُستوفى
backup جاهز ✅ · DDL محصور في PHI Class A ✅ · validate PASS ✅ · الجداول الخمسة فقط ✅ · لا تغيير بيانات يدوي ✅ · لا runtime deploy ✅ · لا DB role switch ✅ · health PASS ✅ · accounting OFF ✅ · journal=0 ✅ · RLS runtime enforcement موثّق NOT_YET ✅ · rollback ready ✅ · لا أسرار ✅ · push بلا force ✅.

## المتبقّي والخطوة التالية
- **تبعية كود (code-only لاحقاً)**: مسارات إنشاء `packages/blood_bank_donors/blood_bank_units` يجب أن تختم `tenant_id` (وإلا، بعد تبديل الدور، ستفشل WITH CHECK أو تُدرج NULL). تُجمَّع مع نشر مستقبلي — `P1_PHI_TENANT_STAMPING_RUNTIME_COMPATIBILITY`.
- **الجذر**: الإنفاذ الفعلي للـ120 سياسة (115 + 5) يبدأ فقط عند `SECRET_READY_EXECUTE_SWITCH` (تبديل الدور إلى nama_medical_app) مع precheck على آلية ضبط `app.tenant_id` لكل طلب.
- **تنبيه audit_trail**: راجع قراءة super-admin العابرة للمستأجر قبل/مع التبديل.

`PHI_CLASS_A_RESIDUAL_RLS_PRODUCTION_DDL_FINAL_CLOSEOUT_COMPLETE`
