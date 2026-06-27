# P1 — إغلاق مرشّح توفيق كود ختم tenant_id (Defense-in-Depth + namaweb Reconciliation)

> المرحلة: `P1_RLS_CODE_LEVEL_TENANT_STAMPING_DEFENSE_IN_DEPTH_AND_NAMAWEB_RECONCILIATION` | التاريخ: 2026-06-21 | candidate/code-only، **بلا تعديل/دفع namaweb، بلا deploy/restart/DDL/GRANT/accounting**.

## ملخص
الخطر الوظيفي (انحدار الكتابة) **مرفوع بالفعل** بـ DB tenant_id DEFAULT (Phase 157، تحقق 31/31). هذه المرحلة تُعدّ **دفاع-في-العمق كودياً** (Batch 1 patch spec) + تكشف العائق الحقيقي: **تشعّب فرعَي namaweb** الذي يمنع دفع/دمج كود نظيفاً بلا قرار مالك. لم يُعدَّل أو يُدفَع أي كود namaweb (Option C: patch spec تحت docs/patches فقط).

## العائق (سبب BLOCKED)
```text
namaweb main @ 039a7d7 (المنشور/الجاري) ↔ origin/master @ 10ded01 (سطري الأمني)
merge-base = c6e44ae ؛ متشعّبان (non-FF بالاتجاهين)
=> دفع كود إلى master = non-FF ⇒ يحتاج force (محظور). تعديل الفرع الحي يخالف "لا overwrite".
=> القرار للمالك: أي سطر canonical + كيفية الدمج (merge/cherry-pick انتقائي بلا force).
```

## المُنتَج (جاهز، غير مُطبَّق)
`docs/patches/rls_code_stamping_batch1_AR.md` — patch spec دقيق (import + logAudit + 6 مسارات: blood_bank_units/donors, transport_requests, insurance_claims, medical_records, medical_certificates). كله ختم tenant_id (+facility_id حيث العمود موجود؛ transport_requests tenant_id فقط) من سياق موثوق + requireTenantScope + لا ثقة بالـbody، **فوق** DB default (fallback، لا يُكسَر).

## الحقول
```text
FINAL_STATUS: BLOCKED_PENDING_BRANCH_DECISION
SELECTED_PHASE: P1_RLS_CODE_LEVEL_TENANT_STAMPING_DEFENSE_IN_DEPTH_AND_NAMAWEB_RECONCILIATION
USER_VISIBLE_ON_WEBSITE: NO (candidate spec فقط؛ لا تغيير)
LIVE_NAMAWEB_HEAD_BEFORE: 039a7d7
LIVE_NAMAWEB_HEAD_AFTER: 039a7d7 (دون تغيير)
PARENT_HEAD_BEFORE: 83516a1
PARENT_HEAD_AFTER: (بعد commit هذه التقارير)
DB_ROLE_CURRENT: nama_medical_app
RLS_RUNTIME_ENFORCEMENT: YES
TENANT_DEFAULT_COUNT: 120/120
MISSING_CODE_STAMPING_FOUND: YES (logAudit + blood-bank + ~44 INSERT؛ كلها protected-by-DB-default)
CODE_DEFENSE_IN_DEPTH_BATCH: Batch 1 patch spec READY (docs/patches) — NOT applied (تشعّب namaweb)
LOGAUDIT_STAMPING_STATUS: MISSING_IN_LIVE ; patch spec ready
BLOOD_BANK_UNITS_STAMPING_STATUS: MISSING_IN_LIVE ; patch spec ready
BLOOD_BANK_DONORS_STAMPING_STATUS: MISSING_IN_LIVE ; patch spec ready
FORCE_RLS_INSERT_ROUTE_STATUS: protected by DB default (Phase 157)؛ code stamping = دفاع-في-العمق (batched)
SECURITY_GUARDS_STATUS: read/update مُغطّى بـ RLS؛ facility entitlement + ALS binding PRESENT
CODE_CHANGED: NO (لا تعديل namaweb؛ patch spec فقط)
CODE_DEPLOYED: NO
DDL_EXECUTED: NO
DATA_CHANGED: NO
PM2_RESTARTED: NO
GRANT_EXECUTED: NO
AUDIT_READER_GRANTED_TO_APP: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
STATIC_TEST_RESULT: N/A لكود (لم يُعدَّل)؛ UTF8/secrets audit على docs = PASS
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: OWNER_RESOLVE_NAMAWEB_MAIN_MASTER_DIVERGENCE (merge/cherry-pick، بلا force) ثم APPLY_BATCH1_PATCH + APPROVE_RLS_CODE_STAMPING_DEPLOY
```

## معيار النجاح — مُستوفى
candidate spec جاهز ✅ · لا force/overwrite ✅ · لا تعديل/دفع namaweb ✅ · ملفات الجلسة الموازية لم تُلمس ✅ · لا deploy/restart/DDL/GRANT/accounting ✅ · العائق (تشعّب) موثّق بدقة مع توصية قرار ✅ · production آمن وثابت (Gate 5) ✅ · لا أسرار ✅.

## تذكير أولوية
الخطر الوظيفي مرفوع بالـDEFAULT؛ Batch 1 دفاع-في-العمق غير عاجل. الأولوية الحقيقية: **قرار توفيق فرعَي namaweb** (حوكمة) ليصبح الكود canonical قابلاً للدمج/النشر.

`RLS_CODE_LEVEL_TENANT_STAMPING_RECONCILIATION_CANDIDATE_FINAL_CLOSEOUT_COMPLETE`
