# إغلاق مصالحة فرع namaweb ودلتا أمان RLS (Final Closeout)

> المرحلة: `NAMAWEB_BRANCH_RECONCILIATION_AND_SECURITY_DELTA_CANDIDATE` | التاريخ: 2026-06-21 | candidate فقط — لا deploy/DDL/GRANT/restart على الإنتاج.

## ملخص تنفيذي
كشف الجرد المنهجي **انحدار كتابة RLS واسعاً ومؤكَّداً تجريبياً** على الإنتاج: ~44 جدول FORCE-RLS لها مسارات INSERT في الكود الحيّ (039a7d7) لا تختم tenant_id، ولا DEFAULT على العمود ⇒ إنشاؤها يفشل **42501** تحت دور nama_medical_app. أُعدّ وأُختبر مرشّح إصلاح **شامل على مستوى القاعدة** (tenant_id DEFAULT) يرفع الانحدار دفعة واحدة دون تعديل كود أو لمس الفرع المتشعّب — **بروفة 6/6** على DB معزول. لم يُنفَّذ على الإنتاج (بانتظار موافقة).

## الحقول
```text
FINAL_STATUS: CODE_CANDIDATE_READY_DEPLOY_APPROVAL_REQUIRED
SELECTED_PHASE: NAMAWEB_BRANCH_RECONCILIATION_AND_SECURITY_DELTA_CANDIDATE
LIVE_NAMAWEB_HEAD_BEFORE: 039a7d7
LIVE_NAMAWEB_HEAD_AFTER: 039a7d7 (دون تغيير — لا كود/نشر)
PARENT_HEAD: (بعد commit التقارير)
DB_ROLE_CURRENT: nama_medical_app
RLS_RUNTIME_ENFORCEMENT: YES
MISSING_SECURITY_FIXES_FOUND: YES — حرج: ~44 جدول FORCE-RLS بمسار INSERT بلا ختم tenant_id ⇒ 42501 (مؤكَّد على transport_requests) + فجوة إسناد logAudit
LOGAUDIT_TENANT_STAMPING: MISSING_IN_LIVE (6 أعمدة؛ يُصلَح بمرشّح الـDEFAULT)
BLOOD_BANK_UNITS_STAMPING: MISSING_IN_LIVE (يُصلَح بمرشّح الـDEFAULT)
BLOOD_BANK_DONORS_STAMPING: MISSING_IN_LIVE (يُصلَح بمرشّح الـDEFAULT)
SECURITY_GUARDS_STATUS: حُرّاس القراءة/التحديث مُغطّاة بـRLS (دفاع-في-العمق عبر الجلسة الموازية)؛ الفجوة = ختم INSERT
CODE_CHANGED: NO (اختير DEFAULT على مستوى القاعدة بدل ~44 patch كود؛ server.js لم يُلمس)
CODE_DEPLOYED: NO
DDL_EXECUTED: NO (candidate فقط؛ بروفة على DB معزول throwaway ثم أُسقط)
GRANT_EXECUTED: NO
DATA_CHANGED: NO
PM2_RESTARTED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
PARALLEL_FILES_TOUCHED: NO (migrate.ps1/protocol_x.ps1 لم تُلمس)
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: APPROVE_RLS_TENANT_ID_DEFAULT_DDL (تطبيق مرشّح المصالحة المُختبَر — عاجل، يرفع انحدار كتابة 44 جدولاً) ثم لاحقاً B/C (إعادة ختم كود + توفيق الفرعين) — وقبل أي audit-reader GRANT/accounting
```

## المرشّح الجاهز (مُختبَر، غير مُنفَّذ)
`docs/sql/rls_tenant_id_default_reconciliation_candidate_{up,validate,down}.sql` — DEFAULT لـ tenant_id على كل جداول FORCE-RLS. بروفة 6/6: BEFORE 42501 → AFTER إدراج بلا tenant_id مسموح ومختوم=1 → forge محجوب → no-ctx محجوب (fail-closed) → down يعيد 42501. لا يضعف العزل، FORCE قائمة، idempotent.

## معيار النجاح — مُستوفى
candidate/plan فقط ✅ · لا deploy/DDL/GRANT/restart ✅ · لا force/overwrite ✅ · ملفات الجلسة الموازية لم تُلمس ✅ · لا .env ✅ · accounting OFF/journal 0 ✅ · المرشّح مُختبَر 6/6 ✅ · الاكتشاف الحرج موثّق مع إثبات تجريبي ✅.

## تحذير
انحدار الكتابة **حيّ على الإنتاج الآن** (إنشاء سجلات في ~44 جدولاً يفشل). القراءة والعزل سليمان (RLS). الإصلاح جاهز ويحتاج `APPROVE` فقط. **لا تبدأ audit-reader GRANT ولا accounting قبل تطبيقه.**

`NAMAWEB_BRANCH_RECONCILIATION_AND_SECURITY_DELTA_CANDIDATE_FINAL_CLOSEOUT_COMPLETE`
