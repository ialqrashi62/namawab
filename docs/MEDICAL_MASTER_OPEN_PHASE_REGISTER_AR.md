# Master Autopilot — سجل المراحل والمجموعات المفتوحة (Open-Phase Register)

> الوضع: `..._CONTINUE_FROM_PHASE_134` — البوابة 1 | محدّث 2026-06-21.

| Area | Phase/Group | Current Status | Risk | Blocking Condition | Allowed Next Action |
| ---- | ----------- | -------------- | ---- | ------------------ | ------------------- |
| أمن/RLS | تبديل دور التشغيل | جاهزية PASS، التحويل محجوب | **P0** | سرّ `nama_medical_app` | `SECRET_READY_EXECUTE_SWITCH` → switch |
| أمن/RLS | 115 FORCE موجودة لكن غير نافذة (app=superuser) | مخطر قائم | **P0** | كما أعلاه | فلاتر التطبيق هي العزل |
| أمن/عزل | Refund IDOR | `PRODUCTION_DEPLOYED_PASS` (8f012a0) | محسوم | — | — |
| أمن/عزل | **Tenant-guard sweep (3 مسارات)** | **مُصلَّب fail-closed (3768bf3) مدفوع؛ غير منشور** — الثغرات حيّة | **P1** | موافقة نشر 3768bf3 | `BLOCKED_PENDING_DEPLOY_APPROVAL` |
| أمن/عزل | مسح موسّع: DELETE employees/system_users، form_templates | مفتوح | P2 | جداول بلا tenant_id (قرار تصميم) | `P1_EXTENDED_IDOR_AND_TENANT_GUARD_DESIGN_SWEEP` |
| محاسبة | invoice schema drift | precondition | **P2** | ALTER محكوم | candidate DDL + plan (read-only) |
| محاسبة | محرك الترحيل + ربطه | جزئي خلف flag OFF؛ journal=0 | P3 | drift + P0 RLS + موافقة | بعدهما |
| محاسبة | DDL/CoA/Mapping | مطبَّق (`DO_NOT_RERUN`) | حُسم | — | — |
| صيدلية/مخزون | FEFO + batch/expiry + consumption | غير منفّذ | P2 | audit/design | `P1_PHARMACY_FEFO_*` |
| مختبر/أشعة | فصل verify/approve + توقيع | جزئي | P2 | code | `P1_LAB_RADIOLOGY_APPROVAL_SEPARATION` |
| سريري/PHI | blood_bank_donors/units، packages (بلا tenant_id) | فجوة Class A | P1 | DDL backfill+RLS | candidate بموافقة |
| أمن | CSRF / قفل حساب / rate limiter افتراضي | مفتوح | P1 | code | تقوية |
| UI/Stitch | Batch A | `DOCS_ONLY_PASS` | P3 | لا MCP/key | `BLOCKED_PENDING_MCP_AND_KEY` |
| حوكمة | R17 / `.gitmodules` / df893ab review | مفتوح | P1/P2 | قرار | توحيد/تسجيل/مراجعة |

```text
GATE1_STATUS: OPEN_PHASE_REGISTER_UPDATED
TOP_LIVE_RISK: 3 tenant-guard IDOR holes still live on 8f012a0 (fix ready 3768bf3, awaiting deploy approval)
TOP_P0: RLS role switch (blocked on secret)
```

`MASTER_OPEN_PHASE_REGISTER_CONTINUE134_COMPLETE`
