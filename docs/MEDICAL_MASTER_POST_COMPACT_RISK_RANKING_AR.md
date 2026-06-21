# Master Autopilot Post-Compact — ترتيب المخاطر (Risk Ranking)

> التاريخ: 2026-06-21.

| الأولوية | البند | الحالة | الإجراء |
| -------- | ----- | ------ | ------- |
| **P0** | تبديل دور RLS (115 FORCE غير نافذة، app=postgres) | محجوب على سرّ | `SECRET_READY_EXECUTE_SWITCH` |
| **P0/P1** | نشر الإصلاحات الأمنية المتراكمة (الموقع الحيّ يفتقدها) | محجوب على موافقة نشر | `APPROVE_DEPLOY c374879+` |
| **P1** | بقية مسارات IDOR (tenant_id موجود) + ختم tenant_id في INSERTs | code-only، آمن | جولات code-only تالية |
| **P1** | PHI Class A (portal_users/audit_trail/packages/blood_bank_*) | candidates جاهزة | `BLOCKED_PENDING_DDL_APPROVAL` |
| **P2** | invoice schema drift | precondition للمحاسبة | read-only + DDL candidate |
| **P3** | المحاسبة/الترحيل | flag OFF؛ محجوب drift+RLS | لا rerun، لا تفعيل |
| **P4** | Pharmacy FEFO / Lab-Rad approvals | غير منفّذة | audit/design |
| **P5** | CSRF/lockout/rate-limiter | مفتوح | plan/hardening |
| **P6** | Stitch/UI | محجوب MCP/key | — |

```text
LIVE_SECURITY_RISK_REDUCIBLE_NOW: accumulated tenant-guard deploy (needs approval)
ROOT_ISOLATION_FIX_BLOCKED_ON_SECRET: RLS runtime role switch
SAFE_SECONDARY_WORK_IF_NO_APPROVAL: candidates/audits + code-only IDOR fixes (this round)
```
`MASTER_POST_COMPACT_RISK_RANKING_COMPLETE`
