# P1 — إغلاق إصلاح Refund IDOR (Final Closeout)

> المرحلة: `P1_REFUND_IDOR_TENANT_GUARD_CODE_FIX` — البوابة 6 | التاريخ: 2026-06-21 | **code-only، لم يُنشَر**.

## ما تم
أُغلقت ثغرة IDOR في `POST /api/invoices/:id/refund`: أصبحت القراءة tenant-scoped (`id + tenant_id`) مع `requireTenantScope`، فلا يستطيع مستأجر استرداد فاتورة لا تخصّه. لا اعتماد على RLS (التطبيق superuser يتجاوزها). الاختبارات 11/11 + انحدار أخضر. العلم المحاسبي بقي OFF، journal=0.

## الحقول
```text
FINAL_STATUS: CODE_ONLY_PUSHED_NOT_DEPLOYED
USER_VISIBLE_ON_WEBSITE: NO
LOCAL_CHANGES_REMAINING: NO (بعد commit/push؛ ملفات Stitch/UI سابقة خارج النطاق لم تُلمَس)
COMMITTED: YES (namaweb + parent gitlink)
PUSHED: YES (namaweb origin/master + parent origin/master؛ بلا force)
PRODUCTION_DEPLOYED: NO
DEPLOYMENT_APPROVAL_REQUIRED: YES
DDL_EXECUTED: NO
DATA_CHANGED: NO
RUNTIME_CODE_CHANGED: YES (refund route + test)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_CREATED: NO
IDOR_FIXED: YES
TESTS_RESULT: 11/11 IDOR + regression green (entitlement 41/0, failclosed 50/0, wave2 38/0, accounting 28/0, leak OK) + node --check OK
RLS_RUNTIME_ROLE_STILL_BYPASSED: YES (التطبيق يتصل postgres/superuser — يبقى الخطر الأكبر)
SECRETS_FOUND: NO
FILES_CHANGED: namaweb(2: server.js + cross_tenant_refund_idor_test.js) + parent gitlink + 6 تقارير + ذاكرة
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: CONTROLLED_DEPLOY_REFUND_IDOR_FIX_THEN_P0_RLS_RUNTIME_ROLE_ENFORCEMENT_RESTORE
```

## تدقيق UTF-8 العربي
`UTF8_ARABIC_AUDIT: PASS`

## تذكير
هذا الإصلاح **لا يُغلق RLS**؛ المشكلة الأكبر باقية: التطبيق يتصل بدور يتجاوز RLS ⇒ المرحلة التالية الإلزامية `P0_RLS_RUNTIME_ROLE_ENFORCEMENT_RESTORE` (ربط `nama_medical_app`).

`REFUND_IDOR_FINAL_CLOSEOUT_COMPLETE`
