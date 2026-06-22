# NamaMedical — قبول المالك بناءً على Harness UAT (مع تأجيل Browser E2E)

> 2026-06-22 | قبول مالك صريح: `APPROVE_OWNER_ACCEPTANCE_WITH_HARNESS_ONLY_AND_DEFER_BROWSER_E2E`. لا تغييرات إنتاجية، لا لمس لعمل الجلسة الموازية.

## أساس القبول (Gate 1 — نطاق القبول)
| البُعد | الحالة | الدليل |
|---|---|---|
| Harness UAT | ✅ PASS | عزل app-path 3/0/0 (patients/employees/branches)، unauth=401، guards 6/6×2، daily_close rehearsal PASS |
| عزل المستأجرين / RLS | ✅ PASS | 148 FORCE RLS، 0 فجوة، role nama_medical_app (super/bypass=false)، binding PASS |
| RBAC (حراسات منشورة) | ✅ PASS | system_users (POST/PUT/DELETE)، employees (POST/DELETE)، 0 ثقة بمستأجر من body/query |
| العمليات / autorecovery | ✅ PASS | PM2 logon resurrect + watchdog 5د (يسجّل OK) + Redis unless-stopped |
| النسخ/التراجع DR | ✅ READY | down.sql per-batch + backups خارجية + incident runbook |
| UX/UI | ✅ PASS | عربي RTL، ثنائي اللغة، responsive، state handling |
| المحاسبة | ✅ OFF (مقبول خارج النطاق) | journal_entries غائب، 0 قيد |
| audit-reader | ⏸ مؤجّل اختياري | candidate جاهز، غير ممنوح |
| الفهارس | ⏸ مؤجّل اختياري | 59/148، لا عائق أداء |
| Browser E2E | ⏸ مؤجّل | لا حسابات اختبار |

## الحالة
```text
FINAL_STATUS: OWNER_ACCEPTANCE_WITH_HARNESS_ONLY_READY
OWNER_ACCEPTANCE_MODE: HARNESS_ONLY_NOW_BROWSER_E2E_DEFERRED
GO_NO_GO: ACCEPT_WITH_BROWSER_E2E_DEFERRED
BROWSER_E2E_STATUS: DEFERRED_PENDING_TEST_ACCOUNT
ACCOUNTING_STATUS: OFF_ACCEPTED
AUDIT_READER_STATUS: DEFERRED_OPTIONAL
TENANT_INDEX_STATUS: DEFERRED_OPTIONAL
```

## شرط الإغلاق المتبقّي (غير حاجز)
تشغيل Browser E2E عند توفّر حسابات اختبار (`PROVIDE_TEST_ACCOUNT_FOR_BROWSER_E2E`) لتأكيد UAT حيّ عبر المتصفح — تحسين تأكيدي، لا يغيّر قرار القبول الحالي.
