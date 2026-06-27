# PHASE 1 — مصفوفة جاهزية بوابات المالك

> 2026-06-22 | كل البوابات موقوفة بقرار/موافقة المالك. لا شيء منها حاجز إنتاج.

| البوابة | الغرض | risk | benefit | DDL | DATA | GRANT | code deploy | rollback | أولوية |
|---|---|---|---|---|---|---|---|---|---|
| PROVIDE_TEST_ACCOUNT_FOR_BROWSER_E2E | تشغيل E2E متصفّح كامل | منخفض | تأكيد UAT حيّ عبر المتصفح | لا | لا | لا | لا | n/a | **عالية** |
| APPROVE_AUDIT_READER_GRANT_AND_DEPLOY | قراءة super-admin للتدقيق عبر المستأجرين | متوسط (GRANT+SET ROLE) | تدقيق آمن بلا bypass | لا | لا | **نعم** | نعم | revoke + down.sql | متوسطة |
| APPROVE_TENANT_ID_INDEX_CANDIDATE_IF_SCALE_NEEDED | فهارس tenant_id للتوسّع | منخفض (CONCURRENTLY) | أداء عند نمو الجداول | **نعم** | لا | لا | لا | DROP INDEX | منخفضة (لا عائق حالي) |
| ACCOUNTING_ENABLEMENT | تشغيل الترحيل المحاسبي | عالٍ | محاسبة كاملة | نعم | نعم | محتمل | نعم | معقّد | **مؤجّل** (موافقة منفصلة) |

## التوصية
المسار الأمثل: (1) حساب اختبار → E2E متصفّح، ثم (2) audit-reader عند الحاجة للتدقيق المركزي، ثم (3) الفهارس عند نمو البيانات. (4) المحاسبة تبقى OFF حتى قرار منفصل.

```text
OWNER_GATES_READY: YES (4 gates documented, none blocking production)
NEXT: owner decision per gate
```
