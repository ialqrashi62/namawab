# Master Autopilot — سجل المراحل والمجموعات المفتوحة (Open-Phase Register)

> الوضع: `..._CONTINUATION` — البوابة 1 | محدّث 2026-06-21.

| Area | Phase/Group | Current Status | Risk | Blocking Condition | Allowed Next Action |
| ---- | ----------- | -------------- | ---- | ------------------ | ------------------- |
| أمن/RLS | تبديل دور التشغيل (`P0_RLS_RUNTIME_ROLE_ENFORCEMENT_RESTORE`) | جاهزية PASS، التحويل محجوب | **P0** | سرّ `nama_medical_app` (scram، خارج git) | عند توفّر السرّ: `P0_RLS_RUNTIME_ROLE_SWITCH_CONTROLLED_EXECUTION` |
| أمن/RLS | 115 FORCE موجودة لكن **غير نافذة** (app=superuser) | مخطر قائم | **P0** | كما أعلاه | فلاتر التطبيق هي العزل حتى التحويل |
| أمن/عزل | **Refund IDOR** | `PRODUCTION_DEPLOYED_PASS` (8f012a0) | محسوم | — | — |
| أمن/عزل | **Tenant-guard sweep** (queue status / referral / claim status) | **هذه الجولة: CODE_ONLY_PUSHED_NOT_DEPLOYED** | P1 | نشر بموافقة | نشر محكوم |
| أمن/عزل | مسح موسّع متبقٍ (DELETE employees/system_users، lookups أقل خطورة) | مفتوح | P2 | جداول بلا tenant_id (قرار تصميم) | مراجعة فردية |
| محاسبة | invoice schema drift | precondition | **P2** | ALTER محكوم | candidate DDL + plan (read-only) |
| محاسبة | محرك الترحيل + ربطه | جزئي خلف flag OFF؛ journal=0 | P3 | drift + RLS role + موافقة | بعد P0 RLS + drift |
| محاسبة | DDL/CoA/Mapping | مطبَّق (`DO_NOT_RERUN`) | حُسم | — | — |
| صيدلية/مخزون | FEFO + batch/expiry + consumption | غير منفّذ | P2 | audit/design ثم code | `P1_PHARMACY_FEFO_*` |
| مختبر/أشعة | فصل verify/approve + توقيع | جزئي | P2 | code | `P1_LAB_RADIOLOGY_APPROVAL_SEPARATION` |
| سريري/PHI | blood_bank_donors/units، packages (بلا tenant_id) | فجوة Class A | P1 | DDL (backfill+RLS) | candidate بموافقة |
| أمن | CSRF / قفل حساب / rate limiter افتراضي | مفتوح | P1 | code | تقوية |
| UI/Stitch | Batch A | `DOCS_ONLY_PASS` | P3 | لا MCP/key | `BLOCKED_PENDING_MCP_AND_KEY` |
| حوكمة | R17 / `.gitmodules` / df893ab review | مفتوح | P1/P2 | قرار | توحيد/تسجيل/مراجعة |

```text
GATE1_STATUS: OPEN_PHASE_REGISTER_UPDATED
TOP_P0: RLS role switch (blocked on secret)
TOP_P1_SAFE_NOW: tenant-guard sweep (selected this round)
```

`MASTER_OPEN_PHASE_REGISTER_CONTINUATION_COMPLETE`
