# 05 — قائمة قرارات المالك (Owner Decision Menu)

> 2026-06-22 | اختر بوابة لتقدّم العمل. كل بوابة مستقلة بموافقة صريحة.

## يفكّ أكبر قدر
- **`PROVIDE_TEST_ACCOUNT_FOR_BROWSER_E2E`** → يفكّ: A1 UI، A2 MFA، A3A file guard، BCMA، WHO، accessibility (6 بنود).

## بوابات تنفيذ آمنة الآن (بلا E2E/مفاتيح)
- **`APPROVE_AUDIT_HARDENING_BACKEND_DEPLOY`** → توسيع التدقيق (backend).
- **`APPROVE_SCHEDULED_LOCAL_BACKUP`** → نسخ محلية مجدولة (التشفير/offsite لاحقاً).

## بوابات تحتاج مفاتيح/أطراف خارجية
- `APPROVE_PHI_ENCRYPTION_VAULT_ROLLOUT` (KMS) · `APPROVE_PHI_FILE_GUARD_DEPLOY` (E2E) · تكاملات Phase B (أطراف خارجية).

## بوابات عالية الخطورة (منفصلة)
- `APPROVE_ACCOUNTING_POSTING_ENABLEMENT` (يبقى OFF حتى قرار صريح) · `APPROVE_TENANT_ID_INDEX` (اختياري، لا عائق) · `APPROVE_AUDIT_READER_GRANT_AND_DEPLOY`.

## مراجعة فقط (بلا بوابة)
- مراجعة فرع R17 beta (قراءة فقط، بلا merge) · candidates Blueprint.

## توصيتي
1) قدّم حساب اختبار (يفكّ 6 بنود) **أو** 2) `APPROVE_SCHEDULED_LOCAL_BACKUP` + `APPROVE_AUDIT_HARDENING_BACKEND_DEPLOY` (تقدّم آمن فوري بلا حواجز). المحاسبة تبقى OFF.
