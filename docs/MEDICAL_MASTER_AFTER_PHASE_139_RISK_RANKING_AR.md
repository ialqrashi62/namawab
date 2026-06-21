# Master Autopilot After-Phase-139 — ترتيب المخاطر

> التاريخ: 2026-06-21.

| الأولوية | البند | الحالة | الإجراء |
| -------- | ----- | ------ | ------- |
| **P0** | تبديل دور RLS (115 FORCE غير نافذة) | محجوب على سرّ + نشر | `SECRET_READY_EXECUTE_SWITCH` بعد النشر |
| **P0/P1** | نشر الإصلاحات الأمنية المتراكمة (الموقع الحيّ يفتقدها كلها) | محجوب على موافقة | `APPROVE_DEPLOY <latest>` |
| **P1** | UPDATE المؤجَّلة + create-route IDOR متبقية | code-only، آمن | جولات code-only تالية |
| **P1** | PHI Class A candidates | جاهزة | `BLOCKED_PENDING_DDL_APPROVAL` |
| **P2** | invoice schema drift | precondition للمحاسبة | read-only + DDL candidate |
| **P3** | المحاسبة/الترحيل | flag OFF؛ محجوب | لا rerun/تفعيل |
| **P4** | Pharmacy FEFO / Lab-Rad | غير منفّذة | audit/design |
| **P5** | CSRF/lockout/rate-limiter | مفتوح | plan |
| **P6** | Stitch/UI | محجوب MCP/key | — |

```text
LIVE_SECURITY_RISK_REDUCIBLE_NOW: deploy accumulated fixes to namaweb 082c07b
ROOT_ISOLATION_FIX_BLOCKED_ON_SECRET: RLS runtime role switch
RLS_SWITCH_PRECONDITION_FIXED_IN_GIT_NOT_LIVE: 4176f4d (insert stamping) + 082c07b (update guards)
SAFE_SECONDARY_WORK_IF_NO_APPROVAL: audits/candidates/code-only not deployed
```
`MASTER_AFTER_PHASE_139_RISK_RANKING_COMPLETE`
