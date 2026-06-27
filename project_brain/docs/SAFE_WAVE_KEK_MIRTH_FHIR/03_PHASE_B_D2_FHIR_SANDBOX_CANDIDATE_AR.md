# Phase B D2 — مرشّح FHIR Sandbox محلي (بلا PHI)

> 2026-06-23 | تصميم مرشّح فقط. sandbox محلي، بيانات dummy فقط، لا PHI حقيقي، لا استدعاء خارجي، لا تغيير إنتاجي.

## الهدف
إثبات مفهوم تحويل بيانات NamaMedical إلى موارد **FHIR R4** على خادم FHIR محلي (مثل HAPI FHIR) ببيانات تجريبية فقط — أساسٌ لـNPHIES وللتبادل المستقبلي، دون لمس الإنتاج أو PHI.

## الموارد المستهدفة + مصدر التحويل (mapping من الـDB الحالي)
| مورد FHIR | المصدر في NamaMedical (dummy فقط) | حقول مفتاحية |
|---|---|---|
| **Patient** | `patients` (صفوف t_dummy) | identifier(national_id*), name(ar/en), gender, birthDate, managingOrganization=tenant |
| **Encounter** | `visit_lifecycle`/المواعيد | status, class, subject→Patient, period, serviceProvider |
| **Observation** | `lab_results`/العلامات الحيوية | code(LOINC*), value, subject, effectiveDateTime, referenceRange |
| **DiagnosticReport** | `lab_radiology_orders`/`lab_results` | code, status, result→Observation[], subject, presentedForm(→/api/phi-files المحمي) |
| **MedicationRequest** | الوصفات/`pharmacy_*` | medication, subject, requester, dosageInstruction, status |
| **Claim (candidate)** | `insurance_claims`/`insurance_*` | patient, insurer, item[], total — أساس NPHIES لاحقاً |

(*) الترميزات (national_id system، LOINC، ICD-10 الموجود) تُحدَّد في mapping تفصيلي؛ في sandbox تُستخدم قيم dummy.

## مبادئ الـSandbox
- **محلي بالكامل** (HAPI FHIR على المنفذ المحلي/حاوية)، معزول عن الإنتاج وعن الشبكة الخارجية.
- **بيانات dummy فقط** (مرضى وهميون، لا PHI حقيقي، لا تصدير من DB الإنتاج).
- لا اتصال NPHIES/أي طرف خارجي — تحقّق بنية/تطابق ملفّات تعريف FHIR فقط.
- التحويل يُبنى كطبقة منفصلة (أو داخل محرّك التكامل D1)، لا داخل مسار الطلبات الإنتاجي.

## خطة التحويل (Mapping)
1. تعريف ملفّات تعريف (profiles) أساسية R4 (لاحقاً KSA profiles لـNPHIES).
2. دوال تحويل صف-DB → مورد FHIR (Patient/Observation أولاً كأبسط).
3. ربط المعرّفات (identifier systems) + الترميزات (code systems).
4. PHI/مرفقات: DiagnosticReport.presentedForm يشير للمسار المحمي `/api/phi-files/:id` (A3A) لا لمحتوى مضمّن.

## خطة التحقّق
- تحقّق المخطّط (FHIR validator) لكل مورد على بيانات dummy.
- جولة round-trip: DB(dummy) → FHIR → إعادة القراءة → مطابقة الحقول.
- اختبار العزل: لا اتصال خارجي يخرج من الـsandbox؛ لا قراءة من DB الإنتاج.
- (لاحقاً) مطابقة KSA profiles عند التحضير لـNPHIES.

## النطاق المؤجّل (بوابة لاحقة)
- تنصيب HAPI FHIR الفعلي + كتابة التحويل (code) = بوابة تنفيذ منفصلة.
- أي اتصال خارجي/NPHIES = بوابات D4 منفصلة بشهادات.

```text
FINAL_STATUS: PHASE_B_D2_FHIR_SANDBOX_CANDIDATE_READY
RESOURCES: Patient, Encounter, Observation, DiagnosticReport, MedicationRequest, Claim(candidate)
REAL_PHI_USED: NO (dummy only)
EXTERNAL_CALLS: NO
PRODUCTION_CHANGES: NONE
```
