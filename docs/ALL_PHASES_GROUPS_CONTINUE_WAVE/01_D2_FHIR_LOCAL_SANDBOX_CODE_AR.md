# Wave 1 — D2 FHIR Local Sandbox Code (candidate)

> 2026-06-23 | كود محلي مستقل، dummy فقط، **غير مربوط بالإنتاج/nginx/أي endpoint**. شُغّل محلياً = 8/8.

## ما نُفِّذ
- `d2_fhir_sandbox/fhir_sandbox.js` (JS صرف، بلا تبعيات، بلا DB/شبكة): mapping من صفوف بشكل NamaMedical → FHIR R4، fixtures تجريبية (مريضان + لقاء + قياسان + تقرير + وصفة + مطالبة)، وبناء **Bundle**، وvalidator محلي.
- **الموارد**: Patient · Encounter · Observation · DiagnosticReport · MedicationRequest · Claim.
- **الـvalidator**: حقول إلزامية لكل مورد + **تكامل المراجع** (كل مرجع Patient يُحلّ داخل الـBundle) + **حارس PHI** (لا بايتات صورة مضمّنة؛ DiagnosticReport.presentedForm = مرجع `/api/phi-files/:id` فقط).
- **النتيجة**: 8/8 PASS (8 موارد في Bundle).

## التشغيل المحلي
```
node docs/ALL_PHASES_GROUPS_CONTINUE_WAVE/d2_fhir_sandbox/fhir_sandbox.js
```
لا DB، لا شبكة، لا PHI؛ يطبع PASS/FAIL لـdummy فقط.

## mapping من الـDB الحالي (للتنفيذ ببوابة، بلا PHI حقيقي)
patients→Patient · visit_lifecycle→Encounter · lab_results→Observation · lab_radiology_orders→DiagnosticReport(صورة عبر المسار المحمي) · الوصفات→MedicationRequest · insurance_claims→Claim.

## النطاق المؤجّل (بوابة لاحقة)
تنصيب HAPI FHIR محلي + تحقّق بالـvalidator الرسمي + KSA profiles (لـNPHIES) — كلها dummy/محلي.

```text
D2_FHIR_STATUS: LOCAL_SANDBOX_CODE_CANDIDATE_READY
LOCAL_TEST: 8/8 PASS (bundle, ref-integrity, PHI-guard)
REAL_PHI_USED: NO
EXTERNAL_CALLS: NO
PRODUCTION_WIRING: NO
```
