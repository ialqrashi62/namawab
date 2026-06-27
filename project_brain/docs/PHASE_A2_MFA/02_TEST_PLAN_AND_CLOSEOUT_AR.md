# Phase A2 — MFA: خطة الاختبار والإغلاق (Candidate Only)

> 2026-06-22 | candidate جاهز؛ لا deploy، لا DB change، لا تغيير login.

## خطة الاختبار (تُشغَّل عند التنفيذ لاحقاً بموافقة + حساب E2E)
| # | الفئة | الحالة | المتوقّع |
|---|---|---|---|
| 1 | enroll | توليد secret + QR ثم confirm بـTOTP صحيح | mfa_enabled=true + recovery codes تُعرَض مرة |
| 2 | login (mfa off) | مستخدم بلا MFA | كما هو (session.user) |
| 3 | login (mfa on) step1 | password صحيح | mfa_required=true، **لا session.user بعد** |
| 4 | mfa verify | TOTP صحيح | session.user يُنشأ |
| 5 | mfa verify خاطئ | TOTP خاطئ | 401 + rate-limit + audit MFA_FAIL |
| 6 | recovery code | كود صحيح لمرة واحدة | دخول + يُعلَّم used |
| 7 | recovery reuse | نفس الكود مرتين | مرفوض |
| 8 | admin reset | Admin يعيد تسجيل MFA لمستخدم | mfa_enabled=false + audit MFA_RESET_BY_ADMIN (لا قراءة سر) |
| 9 | last-admin | تعطيل/قفل آخر أدمن | محظور |
| 10 | secret privacy | السر لا يُعاد في أي API/log | غير مكشوف |
| 11 | RBAC | enroll/verify خلف requireAuth؛ admin reset Admin-only | 401/403 الملائم |
| 12 | rollback | feature-flag mfa_enabled=false / down.sql | دخول غير مكسور |
| 13 | accounting | لا تأثّر | OFF، journal 0 |

## الإغلاق
```text
FINAL_STATUS: PHASE_A2_MFA_CANDIDATE_READY_PENDING_BROWSER_E2E_OR_OWNER_APPROVAL
CODE_DEPLOYED: NO
DB_CHANGED: NO
LOGIN_FLOW_CHANGED: NO
DDL_EXECUTED: NO
DATA_CHANGED: NO
GRANT_EXECUTED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
ARTIFACTS: 01_design + sql/001_{up,validate,down} + 02_test_plan
DEPENDENCIES: مكتبة TOTP (otplib/speakeasy)؛ تشفير at-rest للسر (Phase A3)؛ UI enroll/verify (يحتاج E2E)
NEXT_REQUIRED_ACTION: PROVIDE_TEST_ACCOUNT_FOR_BROWSER_E2E ثم APPROVE_MFA_DDL_AND_DEPLOY (نشر تدفّق login حسّاس يحتاج تحقّق E2E)
```

## لماذا candidate فقط
نشر MFA يعدّل **تدفّق تسجيل الدخول الإنتاجي** (أحسّ مسار في النظام)؛ بلا Browser E2E (لا حساب اختبار) قد يقفل المستخدمين. لذا التصميم/المرشّح جاهز، والتنفيذ بعد توفّر حساب اختبار + موافقة صريحة. يُربط tie تشفير السر at-rest ببند Phase A3.

تم تحديد المسار الصحيح بعد Phase A1: إما إكمال UI/E2E عند توفر الحسابات أو تجهيز MFA كمرشح فقط دون نشر
