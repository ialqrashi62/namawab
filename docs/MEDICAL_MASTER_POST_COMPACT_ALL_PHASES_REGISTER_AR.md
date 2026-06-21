# Master Autopilot Post-Compact — سجل كل المراحل (All Phases Register)

> التاريخ: 2026-06-21.

| Domain | Phase/Group | Status | Live? | Risk | Blocker | Allowed Action |
| ------ | ----------- | ------ | ----: | ---- | ------- | -------------- |
| RLS | `P0_RLS_RUNTIME_ROLE_SWITCH` | جاهز، محجوب | no | **P0** | secret | عند `SECRET_READY_EXECUTE_SWITCH` |
| RLS | 115 FORCE غير نافذة (app=postgres) | قائم | n/a | **P0** | secret | فلاتر التطبيق مؤقتاً |
| IDOR | Refund IDOR | منشور | **YES** | محسوم | — | — |
| IDOR | الإصلاحات المتراكمة (8 مسارات: tenant guards + visits + هذه الجولة 4) | code، **غير منشورة** | no | **P1** | موافقة نشر | `BLOCKED_PENDING_DEPLOY_APPROVAL` |
| IDOR | بقية المسارات (nursing/assessment، blood-bank crossmatch/transfusions، lab/rad UPDATE TOCTOU) | مؤكَّدة، tenant_id موجود | no | P1 | code | جولة تالية (نفس النمط) |
| IDOR | blood_bank_units/donors (بلا tenant_id) | فجوة | no | P1 | DDL | عبر `phi_class_a_residual_rls_candidate` |
| IDOR | obgyn_* (جداول ABSENT) | غير فعّالة | no | منخفض | — | إن أُحييت: tenant_id+ملكية |
| PHI | `P1_PHI_HIGH_RISK_TABLES_REVIEW` | candidates جاهزة | no | P1 | DDL | `BLOCKED_PENDING_DDL_APPROVAL` |
| نظامي | INSERTs لا تختم tenant_id لجداول FORCE | مكتشَف | n/a | **P2 (precondition للتبديل)** | code | تدقيق مكرّس قبل role switch |
| Accounting | DDL/CoA/Mapping مطبَّق؛ flag OFF؛ journal=0 | — | n/a | P3 | drift+RLS | لا rerun |
| Accounting | invoice schema drift | precondition | no | P2 | ALTER candidate | read-only candidate |
| Pharmacy | FEFO/batch/expiry/consumption | غير منفّذ | no | P2 | audit | audit/design |
| Lab/Rad | فصل verify/approve + توقيع | جزئي | partial | P2 | code | audit/design |
| Security | CSRF/lockout/rate-limiter | مفتوح | partial | P1 | code | plan/hardening |
| Stitch | Batch A | docs only | no | P3 | MCP/key | `BLOCKED_PENDING_MCP_AND_KEY` |
| حوكمة | R17 / `.gitmodules` / df893ab | مفتوح | n/a | P1/P2 | قرار | توحيد/تسجيل/مراجعة |

`MASTER_POST_COMPACT_ALL_PHASES_REGISTER_COMPLETE`
