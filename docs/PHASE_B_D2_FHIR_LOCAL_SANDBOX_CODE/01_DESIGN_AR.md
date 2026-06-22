# Phase B D2 — FHIR Local Sandbox Code — التصميم

> 2026-06-23 | sandbox محلي قابل للتشغيل تحت `tools/fhir-sandbox/`، **مستقل تماماً عن الإنتاج** (لا routes/nginx/PM2)، dummy فقط، بلا DB/شبكة/PHI.

## الموقع والبنية
`tools/fhir-sandbox/`:
- `fixtures.js` — صفوف dummy تركيبية (ids 9001/9002، أرقام هوية وهمية).
- `mappers.js` — تحويل صف بشكل NamaMedical → مورد FHIR R4 + `buildBundle`.
- `validate.js` — مدقّق بنيوي + تكامل المراجع + حارس PHI.
- `test.js` — تأكيدات + tripwire يمنع أي استدعاء http/https.
- `README.md` — التشغيل والضمانات.

## الموارد المدعومة (FHIR R4)
Patient · Encounter · Observation · DiagnosticReport · MedicationRequest · Claim.

## mapping من الـDB الحالي (مرجعي؛ لا قراءة DB في هذه البوابة)
patients→Patient (identifier=national_id system خاص، name ar/en، managingOrganization=tenant) · visit_lifecycle→Encounter · lab_results→Observation (LOINC + UCUM) · lab_radiology_orders→DiagnosticReport (presentedForm = `/api/phi-files/:id` المحمي فقط) · الوصفات→MedicationRequest · insurance_claims→Claim.

## مبادئ السلامة المضمّنة في الكود
- **بلا DB**: لا قراءة/كتابة؛ fixtures في الذاكرة فقط.
- **بلا شبكة**: `test.js` يركّب tripwire على `http/https.request|get` يرمي استثناءً عند أي محاولة خروج.
- **حارس PHI**: صور التقرير مراجع محمية، لا بايتات مضمّنة (`!f.data` + تطابق `/api/phi-files/`).
- **بلا PHI حقيقي**: تأكيد أن المعرّفات ≥9000 والأرقام وهمية.
- **غير موصول بالإنتاج**: لا require من `namaweb/server.js`، لا تسجيل route، لا PM2.

## النطاق المؤجّل (بوابة لاحقة)
تنصيب HAPI FHIR محلي + التحقّق بالـvalidator الرسمي + KSA profiles لـNPHIES — dummy/محلي فقط.
