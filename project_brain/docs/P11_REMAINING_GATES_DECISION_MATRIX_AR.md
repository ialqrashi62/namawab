# PHASE 11 — مصفوفة قرار البوابات المتبقية

> 2026-06-22 | كلها موقوفة بموافقة صريحة. لا شيء نُفِّذ.

| # | البوابة | risk | benefit | DDL | DATA | GRANT | deploy | rollback | أولوية |
|---|---|---|---|---|---|---|---|---|---|
| 1 | APPROVE_DAILY_CLOSE_TENANT_RLS_DDL | منخفض (جدول فارغ، مُرهَّن PASS) | يغلق فجوة عزل مالي خاملة قبل الامتلاء | **نعم** | لا (فارغ) | لا | لا (RLS+DEFAULT يغطّي المسارات) | down.sql جاهز | **عالية** |
| 2 | APPROVE_AUDIT_READER_GRANT_AND_DEPLOY | متوسط (GRANT + SET ROLE) | قراءة super-admin عبر المستأجرين للتدقيق بأمان | لا | لا | **نعم** | نعم | down.sql + revoke | متوسطة |
| 3 | APPROVE_TENANT_ID_INDEX_CANDIDATE_IF_SCALE_NEEDED | منخفض (CONCURRENTLY) | أداء عند نمو الجداول | **نعم** | لا | لا | لا | DROP INDEX | منخفضة (لا عائق حالي) |
| 4 | PROVIDE_TEST_ACCOUNT_FOR_BROWSER_E2E | منخفض | تشغيل E2E متصفّح كامل | لا | لا | لا | لا | n/a | متوسطة |
| 5 | ACCOUNTING_ENABLEMENT | عالٍ | تشغيل الترحيل المحاسبي | نعم | نعم | محتمل | نعم | معقّد | **مؤجّل** (موافقة منفصلة مستقبلية) |

## التوصية
ابدأ بـ(1) daily_close (مخاطرة أدنى، مُرهَّن، يغلق فجوة مالية)، ثم (4) حساب اختبار، ثم (2) audit-reader، ثم (3) الفهارس عند الحاجة. (5) المحاسبة تبقى OFF.
