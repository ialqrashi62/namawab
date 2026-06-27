# P1 الترحيل المحاسبي — 01 خط الأساس (Baseline)

> المرحلة: `P1_MEDICAL_ACCOUNTING_POSTING_ENGINE_COMPLETION` | التاريخ: 2026-06-20
> ACTIVE_SKILLS: AUTOPILOT_CORE, BILLING_INSURANCE_ACCOUNTING, BUSINESS_LOGIC_AUDIT, DATABASE_SCHEMA_AUDIT, API_AUDIT, RBAC_TENANT_ISOLATION, TEST_SCENARIOS, SECURITY_PRIVACY_AUDIT, PRODUCTION_READINESS_GATE, REPORTS_HYGIENE, ARABIC_UTF8.

## 1. حالة Git
- parent HEAD: `ac9b0f7` ✓ ؛ namaweb HEAD: `3e1c0cd` ✓.
- خارج النطاق (تغييرات قديمة في working tree، لن تُلتزَم): `public/js/app.js`, `public/js/login.js`, `public/login.html`, `walkthrough.md`، وملفات Stitch.

## 2. مراجع التدقيق السابقة
- `MEDICAL_BUSINESS_LOGIC_AUDIT_AR.md`: صنّف "الترحيل المحاسبي" كـ **يدوي/ناقص — P1** ("محرك ترحيل آلي مفقود").
- `MEDICAL_DATA_FLOW_MAP_AR.md`: التدفّق رقم 24 (الترحيل المحاسبي) = ❌ آلي مفقود؛ التدفّقات 14/17/21 (فاتورة/استرداد/فاتورة مورّد) أثرها المحاسبي ⚠️ يدوي.
- `GLOBAL_AUDIT_02/04`: المحاسبة Partial.

## 3. ما يثبته خط الأساس (سيُفصَّل في Gate 1)
البنية المحاسبية موجودة (8 جداول finance) لكنها **خاملة تماماً** — لا منطق ترحيل ولا بيانات. هذه المرحلة: تدقيق + أساس code-first مُختبَر + خطة DDL/بيانات، دون DDL/تغيير بيانات/نشر.

`BASELINE_COMPLETE`
