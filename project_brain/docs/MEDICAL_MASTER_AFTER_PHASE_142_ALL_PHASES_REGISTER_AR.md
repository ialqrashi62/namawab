# سجل كل المراحل والمجموعات المفتوحة بعد Phase 142 (All Phases Register)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_AFTER_PHASE_142` | التاريخ: 2026-06-21 | مراجعة على مستوى النظام بالكامل.

## الجدول الشامل

| Domain | Phase/Group | Current Status | Live? | Risk | Blocker | Allowed Action |
| --- | --- | --- | :--: | :--: | --- | --- |
| 1. RLS runtime role switch | `P0_RLS_RUNTIME_ROLE_SWITCH_CONTROLLED_EXECUTION` | READY (جاهزية مكتملة) لكن مُعطّل | No | **P0** | الأمر `SECRET_READY_EXECUTE_SWITCH` غير صادر + السر غير موجود بالبيئة | انتظار الأمر + توفير السر خارج الشات |
| 2. RLS policies 115 FORCE | RLS armed | السياسات حيّة لكن **مُتجاوَزة** (app=postgres superuser) | Policies: Yes / Enforcement: **No** | **P0** | يعتمد على (1) | لا شيء حتى التبديل |
| 3. PHI Class A residual RLS | `P1_PHI_CLASS_A_RESIDUAL_RLS` | **REHEARSAL PASS (هذه المرحلة، 17/17)** — candidate جاهز ومثبت | No (candidate فقط) | **P1** | موافقة DDL للإنتاج | `APPROVE_PHI_CLASS_A_DDL` |
| 4. Tenant guards المنشورة | refund/queue/referral/claim/visits/records/certs/followup/bookings/insert-stamping/multi-row-update | **LIVE (082c07b)** | **Yes** | مُخفَّف | — | مراقبة |
| 5. Invoice schema drift | DDL إضافي | **مُطبَّق (25 عمود)** | **Yes** | منخفض | — | خطة posting موجودة |
| 6. Accounting posting | `runEventWithPosting` flag-gated | الراية **OFF**؛ خطة الربط موجودة | No | متوسط (حتى التفعيل) | قرار المالك بالتفعيل | `APPROVE_ENABLE_POSTING` لاحقاً |
| 7. Pharmacy FEFO | `P1_PHARMACY_FEFO_AND_BATCH_ENFORCEMENT_AUDIT` | لم يبدأ | ? | P4 | — | audit آمن |
| 8. Lab/Radiology approvals | `P1_LAB_RADIOLOGY_APPROVAL_SEPARATION_AUDIT` | لم يبدأ | ? | P4 | — | audit آمن |
| 9. Blood bank / packages | crossmatch/transfusions guards LIVE؛ donors/units/packages بلا tenant_id | crossmatch/transfusions: Yes ؛ donors/units/packages: No | P1/P4 | PHI DDL لـ donors/units/packages (مثبت في rehearsal) | `APPROVE_PHI_CLASS_A_DDL` |
| 10. CSRF / lockout / rate limiter | `P1_AUTH_HARDENING_CSRF_LOCKOUT_RATE_LIMIT_PLAN` | فجوة، بلا خطة بعد | No | P5 | — | plan آمن |
| 11. Stitch / UI MCP | UI redesign | `BLOCKED_PENDING_MCP_AND_KEY` | No | P6 | MCP + مفتاح | لا شيء |
| 12. Git / governance / UTF-8 | حوكمة | متزامن ونظيف | Yes | منخفض | `.gitmodules` غير مُسجَّل (gitlink يتيم) | تسجيل لاحق |

## ملاحظات
- العمود "Live?" يفرّق بين السياسات المُعرَّفة وبين **الإنفاذ الفعلي** — البند (2) حيّ كتعريف لكنه غير مُنفَّذ بسبب دور superuser.
- البند (3) تقدّم هذه الجولة من "candidate غير مُختبَر" إلى **"REHEARSAL PASS"** — التفاصيل في `P1_PHI_CLASS_A_RESIDUAL_RLS_REHEARSAL_AR.md`.

`ALL_PHASES_REGISTER_COMPLETE`
