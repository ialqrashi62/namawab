# Phase 8 (نشر الاسترداد) + Phase 13 (مراجعة df893ab) — تقرير

> التاريخ: 2026-06-20. **flag OFF، journals=0/0، posting معطّل.**

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## Gate 0
parent `0355b0f` متزامن؛ DB_USER=nama_medical_app؛ flag OFF؛ health 200؛ redis PONG؛ pm2 online؛ journals 0/0. backup `backup/before-final-master2`.

## Phase 8 — نشر حدث الاسترداد (code-only، flag OFF)
- دمج `feature/refund-event` → namaweb master بـ fast-forward (`4d2bcaf..a22da19`)، مرفوع.
- مؤشّر gitlink الأب: `4d2bcaf → a22da19`.
- pm2 restart ⇒ **health 200، login 200، refund route 401 (محمي)، flag OFF، journals 0/0**.
- السلوك مع flag OFF: مسار الاسترداد ينشئ فاتورة استرداد فقط (لا قيد) + يختم tenant_id/facility_id من الفاتورة الأصلية (تحسين عزل). مطابق وظيفياً للسابق عند OFF.
- staging سبق إثباته 5/5 (متوازن 30=30 Dr 4090/Cr 1000، idempotent، flag OFF بلا قيد).
- الاسترجاع: إعادة gitlink إلى 4d2bcaf + checkout + pm2 restart (فوري).
```text
PHASE8_STATUS: REFUND_EVENT_CODE_DEPLOYED_FLAG_OFF_PASS
```

## Phase 13 — مراجعة delta الأمني لـ df893ab (read-only، بلا دمج)
df893ab ("feat(security): harden server security", 2026-06-11) — فرع namaweb متباعد غير مدموج (ليس سلف master). يحوي 3 بنود؛ المقارنة مع master الحالي (a22da19):
| البند | df893ab | master الحالي | القرار |
|---|---|---|---|
| حارس SESSION_SECRET في الإنتاج (exit إن غاب) | موجود | **مفقود** | **موصى به** (إعادة تنفيذ طازج، لا دمج df893ab) |
| محدّد معدل عام لكل `/api/` (globalApiLimiter 500/15m) | موجود | **مفقود** (يوجد loginLimiter فقط) | **موصى به بحذر** (سلوكي — قد يحدّ ترافيكاً شرعياً؛ يحتاج مراجعة/اختبار) |
| تصليب كوكي الجلسة (httpOnly:true, sameSite:'lax') | موجود | **موجود بالفعل** | لا حاجة |
**القرار**: `df893ab` **لا يُدمج** (قاعدة). البندان المفقودان يُعاد تنفيذهما كـ commits طازجة في **مرحلة أمنية منفصلة معتمدة** (staging + اختبار + نشر flag-safe) — لا يُطبَّقان الآن (كود سلوكي يحتاج موافقة نشر).
```text
PHASE13_STATUS: SECURITY_HARDENING_DELTA_REVIEWED_DEFERRED (df893ab NOT merged)
DF893AB_DELTA: 2 missing items (SESSION_SECRET guard, global /api rate limiter) ; 1 already present (cookie hardening)
```

## الحالة النهائية
```text
FINAL_STATUS: REFUND_EVENT_CODE_DEPLOYED_FLAG_OFF_PASS + SECURITY_HARDENING_DELTA_REVIEWED_DEFERRED
PRODUCTION_TOUCHED: YES (gitlink 4d2bcaf->a22da19, refund code-only, flag OFF)
DATA_CHANGED: NO
DDL_EXECUTED: NO
DEPLOYED: YES (code-only, flag OFF)
POSTING_ENABLED: NO
PROD_JOURNALS_WRITTEN: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: (gated) prod RLS auth-smoke/risk-accept ; Group D-18 business decisions ; grants hardening (usage observation) ; accounting go-live (dedicated approval) ; security phase to re-implement df893ab's 2 missing guards ; reboot autostart (admin)
```
