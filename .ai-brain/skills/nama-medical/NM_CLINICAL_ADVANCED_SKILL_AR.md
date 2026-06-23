# NM_CLINICAL_ADVANCED_SKILL

**الغرض**: الميزات السريرية المتقدمة. **التفعيل**: بوابات Phase C السريرية.

## النطاق (candidate-first)
BCMA · eMAR hardening (يبني على A1 lock) · ICU scores (APACHE/SOFA) · ESI triage · WHO surgery checklist · drug interaction (جدول drug_interactions موجود) · allergy checks · clinical BI · quality/readmission/infection indicators.

## القواعد
candidate-first؛ **لا أتمتة قرار سريري في الإنتاج بلا اختبار**؛ CDS = `BLOCKED_PENDING_SAFE_TEST_DATA`؛ أي قرار سريري مباشر = `BLOCKED_PENDING_CLINICAL_OWNER_APPROVAL`. NO_REAL_PHI؛ بيانات اختبار آمنة مطلوبة. سلامة التدقيق السريري (A1 sign/amend) قائمة.

## التصنيفات
`CANDIDATE_READY · BLOCKED_PENDING_SAFE_TEST_DATA · BLOCKED_PENDING_CLINICAL_OWNER_APPROVAL`.

## حقول الإغلاق
`PHASE_C_STATUS · REAL_PHI_USED(NO) · PRODUCTION_CLINICAL_AUTOMATION(NO) · DDL_EXECUTED · NEXT_GATE`.
