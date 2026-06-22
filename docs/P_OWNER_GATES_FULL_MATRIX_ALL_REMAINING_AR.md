# مصفوفة بوابات المالك الكاملة — كل المتبقّي

> 2026-06-22 | كل البوابات موقوفة بقرار/موافقة المالك. هذا التوجيه لم يحمل أي موافقة جديدة ⇒ لا تنفيذ. لا حاجز حرج.

| # | البوابة | إلزامي/اختياري | risk | benefit | DDL | DATA | GRANT | deploy | credentials | rollback | أولوية | قرار المالك المطلوب |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Browser E2E final acceptance | إلزامي للقبول الرسمي (ليس حاجز تشغيل) | منخفض | تأكيد UAT حيّ عبر المتصفح | لا | لا (test-only) | لا | لا | **نعم** | n/a | **عالية** | PROVIDE_TEST_ACCOUNT أو APPROVE_CREATE_TEMP_BROWSER_E2E_TEST_ACCOUNTS |
| 2 | Audit-reader grant/deploy | اختياري | متوسط (GRANT+SET ROLE) | تدقيق super-admin عبر المستأجرين | لا | لا | **نعم** | نعم | لا | revoke+down.sql | متوسطة | APPROVE_AUDIT_READER_GRANT_AND_DEPLOY |
| 3 | tenant_id indexes | اختياري | منخفض (CONCURRENTLY) | أداء عند التوسّع | **نعم** | لا | لا | لا | لا | DROP INDEX | منخفضة (لا عائق) | APPROVE_TENANT_ID_INDEX_CANDIDATE_IF_SCALE_NEEDED |
| 4 | Accounting enablement | مؤجّل (خارج النطاق) | عالٍ | محاسبة كاملة | نعم | نعم | محتمل | نعم | لا | معقّد | مؤجّل | APPROVE_ACCOUNTING_POSTING_ENABLEMENT |
| 5 | Harness-only owner acceptance | بديل للبوابة 1 | منخفض | قبول فوري بناءً على harness UAT (تأجيل المتصفح) | لا | لا | لا | لا | لا | n/a | بديل | قبول المالك الصريح بالـharness |

## حالة كل بوابة الآن
```text
1. Browser E2E: BLOCKED_PENDING_TEST_ACCOUNT (لا حسابات؛ لا موافقة إنشاء)
2. Audit-reader: CANDIDATE_READY_NOT_DEPLOYED (الدور NOLOGIN/NOSUPER/NOBYPASSRLS، التطبيق ليس عضواً)
3. tenant_id indexes: OPTIONAL_NOT_DEPLOYED_NO_CURRENT_PERFORMANCE_BLOCKER (59/148)
4. Accounting: OFF_REQUIRES_SEPARATE_APPROVAL (journal_entries غائب، 0 قيد)
5. Harness-only acceptance: متاح بكلمة المالك (harness UAT = PASS)
```

## المسار الموصى
الأسرع للقبول الرسمي: **PROVIDE_TEST_ACCOUNT** (out-of-band) → Browser E2E → قبول نهائي. البدائل (audit-reader/index/accounting) لاحقة بموافقات مستقلة. لا شيء من هذه يمنع تشغيل النواة المُصلَّبة.
