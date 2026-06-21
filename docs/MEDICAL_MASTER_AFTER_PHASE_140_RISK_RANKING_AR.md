# Master Autopilot After-Phase-140 — ترتيب المخاطر

> التاريخ: 2026-06-21.

| الأولوية | البند | الحالة | الإجراء |
| -------- | ----- | ------ | ------- |
| **P0** | تبديل دور RLS (115 FORCE غير نافذة) | محجوب على سرّ + نشر | `SECRET_READY_EXECUTE_SWITCH` بعد النشر |
| **P0/P1** | نشر الإصلاحات الأمنية المتراكمة (3768bf3→082c07b) | محجوب على موافقة | `APPROVE_DEPLOY 082c07b` |
| **P2** | **invoice schema drift** — يكسر مسارات الفواتير على الإنتاج | **candidate جاهز هذه الجولة** | `BLOCKED_PENDING_DDL_APPROVAL` (يُرافق النشر) |
| **P1** | PHI Class A + بقية IDOR | candidates/موثّقة | DDL approval / code لاحق |
| **P3** | المحاسبة/الترحيل | flag OFF؛ محجوب | لا rerun/تفعيل |
| **P4** | Pharmacy FEFO / Lab-Rad | غير منفّذة | audit/design |
| **P5** | CSRF/lockout/rate-limiter | مفتوح | plan |
| **P6** | Stitch/UI | محجوب MCP/key | — |

```text
LIVE_SECURITY_RISK_REDUCIBLE_NOW: deploy accumulated fixes to 082c07b
ROOT_ISOLATION_FIX_BLOCKED_ON_SECRET: RLS runtime role switch
RLS_SWITCH_PRECONDITION_FIXED_IN_GIT_NOT_LIVE: 082c07b
NEW_FINDING_THIS_ROUND: invoice schema drift يكسر create/cancel/partial-pay/refund على الإنتاج ⇒ يجب تطبيق DDL candidate مع النشر
SAFE_SECONDARY_WORK_IF_NO_APPROVAL: audits/candidates only (لا مزيد من code-only tenant guards)
```
`MASTER_AFTER_PHASE_140_RISK_RANKING_COMPLETE`
