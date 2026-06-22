# Phase B D2 — FHIR Local Sandbox — مرشّح كود (candidate)

> 2026-06-23 | مرشّح كود محلي ببيانات dummy فقط. **لا PHI، لا DB، لا استدعاء خارجي، غير موصول بالتطبيق الإنتاجي.** نُفِّذ محلياً للتحقّق (7/7).

## ما أُنجز
- نموذج تحويل أوّلي مستقل: `fhir_mapping_prototype.js` (JS صرف، بلا تبعيات) يحوّل صفوفاً **تجريبية** بشكل NamaMedical إلى موارد **FHIR R4**:
  Patient · Encounter · Observation · DiagnosticReport · MedicationRequest · Claim.
- تحقّق بنيوي محلي (بلا validator خارجي/شبكة): وجود `resourceType` + الحقول الإلزامية + مرجع `subject` بصيغة `Patient/<id>`.
- **حارس PHI**: `DiagnosticReport.presentedForm` يشير للمسار المحمي `/api/phi-files/:id` (A3A) ولا يضمّن بايتات الصورة.
- النتيجة: **7/7 PASS** (6 موارد + فحص المرجع المحمي)، dummy فقط.

## كيف يُشغَّل محلياً
```
node docs/PHASE_B_D2_FHIR_SANDBOX/fhir_mapping_prototype.js
```
لا يتصل بقاعدة بيانات ولا بأي endpoint؛ يطبع PASS/FAIL لبيانات dummy فقط.

## خطة التحويل (mapping) من الـDB الحالي (للتنفيذ ببوابة لاحقة، بلا PHI حقيقي)
| مورد | مصدر NamaMedical | ملاحظة |
|---|---|---|
| Patient | `patients` | identifier=national_id (system خاص)، name ar/en، managingOrganization=tenant |
| Encounter | `visit_lifecycle`/المواعيد | class/period/serviceProvider=facility |
| Observation | `lab_results`/العلامات | code=LOINC (لاحقاً)، valueQuantity + UCUM |
| DiagnosticReport | `lab_radiology_orders`/`lab_results` | presentedForm → /api/phi-files المحمي فقط |
| MedicationRequest | الوصفات/`pharmacy_*` | medication/dosage/requester |
| Claim | `insurance_claims`/`insurance_*` | أساس NPHIES لاحقاً |

## خطة التحقّق (عند تنصيب HAPI FHIR محلي — بوابة لاحقة)
1. تشغيل HAPI FHIR **محلي** (loopback، بلا PHI).
2. رفع الموارد المُولّدة من dummy + تحقّق بالـvalidator الرسمي.
3. round-trip: dummy-row → FHIR → قراءة → مطابقة.
4. (لاحقاً) مطابقة KSA profiles تمهيداً لـNPHIES.

## حدود صريحة
```text
REAL_PHI_USED: NO (dummy only)
DB_ACCESS: NO | EXTERNAL_CALLS: NO | WIRED_TO_PRODUCTION: NO
```

## الحقول
```text
FINAL_STATUS: PHASE_B_D2_FHIR_SANDBOX_CANDIDATE_READY
PROTOTYPE_VALIDATION: 7/7 PASS (dummy)
RESOURCES: Patient, Encounter, Observation, DiagnosticReport, MedicationRequest, Claim
NEXT_GATE: APPROVE_PHASE_B_D2_FHIR_LOCAL_SANDBOX_CODE (install HAPI FHIR local + wire mapping, dummy only)
```
