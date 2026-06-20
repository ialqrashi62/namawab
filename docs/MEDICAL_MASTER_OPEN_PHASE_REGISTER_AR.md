# Master Autopilot — سجل المراحل والمجموعات المفتوحة (Open-Phase Register)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_ALL_PHASES_AND_GROUPS` — البوابة 1 | التاريخ: 2026-06-21 | جُمِع من التقارير + الذاكرة + فحص read-only لهذه الجولة.

## ملاحظة تحديث جوهري (من فحص هذه الجولة)
تباين RLS (R1) **لم يعد 13 مقابل 115**: الواقع الحالي على single-box prod = **115 FORCE / 115 policies / 118 جدول بـ tenant_id** (ENABLE-only=0). لكن **RLS مُعطَّل فعلياً** لأن التطبيق يتصل بدور `postgres` (superuser, bypassrls=true) ⇒ السياسات تُتجاوَز. يوجد دور أقل صلاحية `nama_medical_app` (غير-superuser) لكنه **غير موصول**. التفاصيل في تقرير المصالحة.

## السجل
| Area | Phase/Group | Current Status | Risk | Blocking Condition | Allowed Next Action |
| ---- | ----------- | -------------- | ---- | ------------------ | ------------------- |
| RLS/عزل | تباين RLS (R1) | **RESOLVED-WITH-TWIST**: 115 FORCE حقيقي، لكن مُتجاوَز (app=superuser) | **P1** | الدور المتصل superuser | تسوية توثيقية (هذه الجولة) + توصية wiring لدور أقل صلاحية |
| RLS/عزل | تفعيل دور أقل صلاحية (`nama_medical_app`) | candidate موجود (`app_runtime_role_candidate.sql`) | **P1** | يحتاج GRANTs + تغيير `.env` + redeploy | `BLOCKED_PENDING_DDL_APPROVAL`+`DEPLOY_APPROVAL` |
| RLS/عزل | Class A residual: `packages`,`blood_bank_donors`,`blood_bank_units` (بلا tenant_id/RLS) | فجوة | **P1** | يحتاج backfill tenant_id + RLS (DDL) | candidate في مرحلة Class A منفصلة (DDL approval) |
| RLS/عزل | residual RLS: `audit_trail`,`portal_users` (بهما tenant_id بلا FORCE) | فجوة أصغر | P2 | يحتاج ENABLE/FORCE+policy (DDL) | candidate (DDL approval) |
| أمن | **Refund IDOR** (`/api/invoices/:id/refund` SELECT بلا فلتر tenant) | مؤكَّد **قابل للاستغلال** (RLS مُتجاوَز) | **P1** | code-only | `P1_REFUND_IDOR_TENANT_GUARD_CODE_FIX` (code fix فوري) |
| أمن | CSRF صريح (R6) / قفل الحساب (R7) / rate limiter افتراضي (R5) | مفتوح | P1 | code-only | تقوية أمنية (code) |
| محاسبة | DDL/CoA/Mapping | **مطبَّق فعلاً** (single-box) — `DO_NOT_RERUN` | حُسم | — | لا إعادة |
| محاسبة | محرك الترحيل + ربطه | موصول جزئياً خلف flag OFF؛ journal=0 | P3 | schema drift + refund IDOR | بعد حسمهما: `CODE_BEHIND_FLAG` |
| محاسبة | invoice schema drift | precondition (أعمدة يكتبها الكود غير موجودة) | **P2** | يحتاج ALTER محكوم | candidate DDL + plan (read-only الآن) |
| محاسبة | partial-pay/generate posting + legacy backfill | مخطّط (Phase 129) | P3 | يتبع code-behind-flag | حسب الخطة |
| صيدلية/مخزون | FEFO + batch/expiry + consumption posting | غير منفّذ | P2 | يحتاج audit/design ثم code | `P1_PHARMACY_FEFO_*` (audit أولاً) |
| مختبر/أشعة | فصل verify/approve + توقيع التقرير | جزئي | P2 | code | `P1_LAB_RADIOLOGY_APPROVAL_SEPARATION` (audit/design) |
| UI/Stitch | Batch A + نقل التصميم | `DOCS_ONLY_PASS` | P3 | **لا MCP/key** | `BLOCKED_PENDING_MCP_AND_KEY` |
| Git/حوكمة | تسجيل `.gitmodules` لـ namaweb | مفتوح | P2 | قرار حوكمي | تسجيل submodule (منفصل) |
| Git/حوكمة | مراجعة delta `df893ab` | مفتوح | P2 | مراجعة أمنية | مراجعة (منفصل) |
| Git/حوكمة | R17 جلستان متوازيتان | قائم | P1 | تشغيلي | توحيد على نسخة واحدة |
| جودة | CI + إطار اختبار رسمي (R15) | مفتوح | P1 | DevOps | لاحقاً |

## النتيجة
```text
GATE1_STATUS: OPEN_PHASE_REGISTER_BUILT
TOP_P1: RLS-effectiveness (superuser bypass) · Refund IDOR (now exploitable) · R17
NEXT: GATE2_PRIORITY_DECISION
```

`MASTER_OPEN_PHASE_REGISTER_COMPLETE`
