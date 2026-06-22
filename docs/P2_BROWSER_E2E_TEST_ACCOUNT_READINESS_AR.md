# PHASE 2 — جاهزية E2E عبر المتصفح / بوابة حساب الاختبار

> 2026-06-22 | لا حساب اختبار حيّ ⇒ لا ادعاء browser E2E.

## الحالة
```text
BROWSER_E2E_STATUS: BLOCKED_PENDING_TEST_ACCOUNT
HARNESS_UAT_STATUS: PASS (مؤكَّد: عزل app-path 3/0/0، unauth=401، guards 6/6×2، daily_close rehearsal PASS)
```

## حسابات الاختبار المطلوبة (من المالك، out-of-band، لا تُطبَع)
```text
- tenant 1 — Admin
- tenant 1 — Doctor/clinical
- tenant 1 — Billing/Finance
- tenant 1 — HR
- (اختياري) tenant ثانٍ (مثلاً 999/2) لاختبار سلبي عبر المستأجرين
```

## سيناريوهات E2E عند توفّر الحساب
login → patients → appointments → clinical read → billing/insurance read-only → admin/security negative (non-admin منع إنشاء/تعديل مستخدم) → cross-tenant (مستأجر آخر = 0) → logout/session.

```text
NEXT_REQUIRED_ACTION: PROVIDE_TEST_ACCOUNT_FOR_BROWSER_E2E
```
