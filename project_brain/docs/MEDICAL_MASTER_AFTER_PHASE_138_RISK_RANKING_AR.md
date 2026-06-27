# Master Autopilot After-Phase-138 — ترتيب المخاطر

> التاريخ: 2026-06-21.

| الأولوية | البند | الحالة | الإجراء |
| -------- | ----- | ------ | ------- |
| **P0** | تبديل دور RLS (115 FORCE غير نافذة) | محجوب على سرّ + نشر + precondition | `SECRET_READY_EXECUTE_SWITCH` بعد النشر |
| **P0 precondition** | ختم tenant_id في INSERTs (7 مسارات) | **عولِج هذه الجولة (code، غير منشور)** | ضمن النشر المتراكم |
| **P0/P1** | نشر الإصلاحات الأمنية المتراكمة (الموقع الحيّ يفتقدها) | محجوب على موافقة | `APPROVE_DEPLOY` |
| **P1** | UPDATE-by-id + blood-bank ownership متبقية | code-only، آمن | مسح multi-row/IDOR تالٍ |
| **P1** | PHI Class A candidates | جاهزة | `BLOCKED_PENDING_DDL_APPROVAL` |
| **P2** | invoice schema drift | precondition للمحاسبة | read-only + DDL candidate |
| **P3** | المحاسبة/الترحيل | flag OFF؛ محجوب | لا rerun/تفعيل |
| **P4** | Pharmacy FEFO / Lab-Rad | غير منفّذة | audit/design |
| **P5** | CSRF/lockout/rate-limiter | مفتوح | plan |
| **P6** | Stitch/UI | محجوب MCP/key | — |

```text
LIVE_SECURITY_RISK_REDUCIBLE_NOW: accumulated tenant guard + stamping deploy to current namaweb HEAD
ROOT_ISOLATION_FIX_BLOCKED_ON_SECRET: RLS runtime role switch
NEW_SWITCH_PRECONDITION: RLS insert tenant_id stamping — أُنجز جزئياً (7 مسارات؛ يُعاد المسح بعد أي مسارات جديدة)
SAFE_SECONDARY_WORK_IF_NO_APPROVAL: audits/candidates/code-only (not deployed)
```
`MASTER_AFTER_PHASE_138_RISK_RANKING_COMPLETE`
